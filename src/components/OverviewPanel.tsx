import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type RepairItem = {
  _id: string;
  title: string;
  category: string;
  status: string;
};

type PropertyItem = {
  _id: string;
  name: string;
  address: string;
  type: string;
};

export function OverviewPanel() {
  const stats = useQuery(api.stats.getDashboardStats);
  const repairs = useQuery(api.repairs.list);
  const properties = useQuery(api.properties.list);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const recentRepairs = repairs?.slice(0, 5) || [];

  const statCards = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: "🏠",
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-400/30"
    },
    {
      label: "Active Tenants",
      value: stats.totalTenants,
      icon: "👥",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-400/30"
    },
    {
      label: "Pending Repairs",
      value: stats.pendingRepairs,
      icon: "🔧",
      color: "from-red-500/20 to-orange-500/10",
      border: "border-red-400/30"
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: "📈",
      color: "from-blue-500/20 to-indigo-500/10",
      border: "border-blue-400/30"
    },
  ];

  const financialCards = [
    {
      label: "Monthly Rent Potential",
      value: `$${stats.monthlyRentPotential.toLocaleString()}`,
      trend: "up"
    },
    {
      label: "Total Income",
      value: `$${stats.totalIncome.toLocaleString()}`,
      trend: "up"
    },
    {
      label: "Total Expenses",
      value: `$${stats.totalExpenses.toLocaleString()}`,
      trend: "down"
    },
    {
      label: "Net Income",
      value: `$${stats.netIncome.toLocaleString()}`,
      trend: stats.netIncome >= 0 ? "up" : "down"
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-amber-100 mb-2">Dashboard Overview</h1>
        <p className="text-amber-200/50 text-sm lg:text-base">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`relative p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="absolute top-2 right-2 lg:top-3 lg:right-3 text-2xl lg:text-3xl opacity-50 group-hover:opacity-80 transition-opacity">
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-amber-200/60 text-[10px] lg:text-xs font-medium tracking-wider uppercase mb-1 lg:mb-2">{stat.label}</p>
              <p className="text-2xl lg:text-4xl font-black text-amber-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial overview */}
      <div className="bg-[#12121a]/50 rounded-xl lg:rounded-2xl border border-amber-400/10 p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-amber-100 mb-4 lg:mb-6 flex items-center gap-2">
          <span>💰</span> Financial Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {financialCards.map((card) => (
            <div key={card.label} className="p-3 lg:p-4 bg-[#0a0a0f]/40 rounded-xl">
              <p className="text-amber-200/50 text-[10px] lg:text-xs font-medium mb-1 lg:mb-2">{card.label}</p>
              <p className={`text-lg lg:text-2xl font-bold ${card.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout for recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent repairs */}
        <div className="bg-[#12121a]/50 rounded-xl lg:rounded-2xl border border-amber-400/10 p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
            <span>🔧</span> Recent Repairs
          </h2>
          {recentRepairs.length === 0 ? (
            <div className="text-center py-8 text-amber-200/40">
              <p className="text-3xl lg:text-4xl mb-2">✨</p>
              <p className="text-sm">No repairs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRepairs.map((repair: RepairItem) => (
                <div
                  key={repair._id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f]/40 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-100 font-medium text-sm truncate">{repair.title}</p>
                    <p className="text-amber-200/40 text-xs capitalize">{repair.category}</p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-[10px] lg:text-xs font-medium rounded-lg shrink-0 ${
                    repair.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                    repair.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                    repair.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {repair.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Properties overview */}
        <div className="bg-[#12121a]/50 rounded-xl lg:rounded-2xl border border-amber-400/10 p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
            <span>🏠</span> Your Properties
          </h2>
          {!properties || properties.length === 0 ? (
            <div className="text-center py-8 text-amber-200/40">
              <p className="text-3xl lg:text-4xl mb-2">🏗️</p>
              <p className="text-sm">No properties yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 5).map((property: PropertyItem) => (
                <div
                  key={property._id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f]/40 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-100 font-medium text-sm truncate">{property.name}</p>
                    <p className="text-amber-200/40 text-xs truncate">{property.address}</p>
                  </div>
                  <span className="ml-2 px-2 py-1 text-[10px] lg:text-xs font-medium rounded-lg bg-amber-500/20 text-amber-400 capitalize shrink-0">
                    {property.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Repair status breakdown */}
      <div className="bg-[#12121a]/50 rounded-xl lg:rounded-2xl border border-amber-400/10 p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-amber-100 mb-4 lg:mb-6 flex items-center gap-2">
          <span>📋</span> Repair Status Breakdown
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="text-center p-3 lg:p-4 bg-amber-500/10 rounded-xl border border-amber-400/20">
            <p className="text-2xl lg:text-3xl font-black text-amber-400">{stats.pendingRepairs}</p>
            <p className="text-amber-200/50 text-xs mt-1">Pending</p>
          </div>
          <div className="text-center p-3 lg:p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
            <p className="text-2xl lg:text-3xl font-black text-blue-400">{stats.inProgressRepairs}</p>
            <p className="text-blue-200/50 text-xs mt-1">In Progress</p>
          </div>
          <div className="text-center p-3 lg:p-4 bg-emerald-500/10 rounded-xl border border-emerald-400/20">
            <p className="text-2xl lg:text-3xl font-black text-emerald-400">{stats.completedRepairs}</p>
            <p className="text-emerald-200/50 text-xs mt-1">Completed</p>
          </div>
          <div className="text-center p-3 lg:p-4 bg-gray-500/10 rounded-xl border border-gray-400/20">
            <p className="text-2xl lg:text-3xl font-black text-gray-400">{stats.totalRepairs}</p>
            <p className="text-gray-200/50 text-xs mt-1">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
