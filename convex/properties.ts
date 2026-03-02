import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("properties")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const property = await ctx.db.get(args.id);
    if (!property || property.userId !== userId) return null;
    return property;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    type: v.union(v.literal("house"), v.literal("apartment"), v.literal("condo"), v.literal("townhouse")),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    monthlyRent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("properties", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("properties"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    type: v.optional(v.union(v.literal("house"), v.literal("apartment"), v.literal("condo"), v.literal("townhouse"))),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    squareFeet: v.optional(v.number()),
    monthlyRent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const property = await ctx.db.get(args.id);
    if (!property || property.userId !== userId) throw new Error("Not found");
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(args.id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const property = await ctx.db.get(args.id);
    if (!property || property.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
