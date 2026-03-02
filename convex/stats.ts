import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const properties = await ctx.db
      .query("properties")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const tenants = await ctx.db
      .query("tenants")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const repairs = await ctx.db
      .query("repairs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const pendingRepairs = repairs.filter((r) => r.status === "pending").length;
    const inProgressRepairs = repairs.filter((r) => r.status === "in_progress").length;
    const completedRepairs = repairs.filter((r) => r.status === "completed").length;

    const totalIncome = transactions
      .filter((t) => t.type.includes("income"))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type.includes("expense"))
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRentPotential = properties.reduce(
      (sum, p) => sum + (p.monthlyRent || 0),
      0
    );

    return {
      totalProperties: properties.length,
      totalTenants: tenants.length,
      pendingRepairs,
      inProgressRepairs,
      completedRepairs,
      totalRepairs: repairs.length,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      monthlyRentPotential,
      occupancyRate: properties.length > 0
        ? Math.round((tenants.length / properties.length) * 100)
        : 0,
    };
  },
});
