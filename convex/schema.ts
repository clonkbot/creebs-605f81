import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Properties owned/managed by the user
  properties: defineTable({
    userId: v.id("users"),
    name: v.string(),
    address: v.string(),
    type: v.union(v.literal("house"), v.literal("apartment"), v.literal("condo"), v.literal("townhouse")),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    monthlyRent: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Tenants for properties
  tenants: defineTable({
    userId: v.id("users"),
    propertyId: v.id("properties"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    leaseStart: v.number(),
    leaseEnd: v.number(),
    rentAmount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_property", ["propertyId"]),

  // Maintenance/repair requests
  repairs: defineTable({
    userId: v.id("users"),
    propertyId: v.id("properties"),
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    category: v.union(v.literal("plumbing"), v.literal("electrical"), v.literal("hvac"), v.literal("appliance"), v.literal("structural"), v.literal("pest"), v.literal("other")),
    estimatedCost: v.optional(v.number()),
    actualCost: v.optional(v.number()),
    scheduledDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"]),

  // Financial transactions
  transactions: defineTable({
    userId: v.id("users"),
    propertyId: v.optional(v.id("properties")),
    type: v.union(v.literal("rent_income"), v.literal("repair_expense"), v.literal("maintenance_expense"), v.literal("utility_expense"), v.literal("other_income"), v.literal("other_expense")),
    amount: v.number(),
    description: v.string(),
    date: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_property", ["propertyId"]),

  // Documents storage
  documents: defineTable({
    userId: v.id("users"),
    propertyId: v.optional(v.id("properties")),
    tenantId: v.optional(v.id("tenants")),
    name: v.string(),
    type: v.union(v.literal("lease"), v.literal("inspection"), v.literal("receipt"), v.literal("insurance"), v.literal("other")),
    fileUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_property", ["propertyId"]),
});
