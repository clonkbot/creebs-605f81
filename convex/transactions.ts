import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    propertyId: v.optional(v.id("properties")),
    type: v.union(v.literal("rent_income"), v.literal("repair_expense"), v.literal("maintenance_expense"), v.literal("utility_expense"), v.literal("other_income"), v.literal("other_expense")),
    amount: v.number(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("transactions", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
