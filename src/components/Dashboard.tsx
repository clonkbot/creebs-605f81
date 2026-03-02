import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PropertiesPanel } from "./PropertiesPanel";
import { RepairsPanel } from "./RepairsPanel";
import { TenantsPanel } from "./TenantsPanel";
import { TransactionsPanel } from "./TransactionsPanel";
import { OverviewPanel } from "./OverviewPanel";

type Tab = "overview" | "properties" | "repairs" | "tenants" | "finances";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = useQuery(api.stats.getDashboardStats);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "properties", label: "Properties", icon: "🏠" },
    { id: "repairs", label: "Repairs", icon: "🔧" },
    { id: "tenants", label: "Tenants", icon: "👥" },
    { id: "finances", label: "Finances", icon: "💰" },
  ];

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,191,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,191,36,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#12121a]/90 backdrop-blur-xl border-b border-amber-400/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-amber-200/70 hover:text-amber-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-[#0a0a0f] font-black text-sm">C</span>
            </div>
            <span className="text-amber-100 font-bold">Creebs</span>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 -mr-2 text-amber-200/50 hover:text-amber-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-72 lg:w-64 h-screen
          bg-[#12121a]/95 lg:bg-[#12121a]/50 backdrop-blur-xl
          border-r border-amber-400/10
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex flex-col h-full p-4 lg:p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 lg:mb-10">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-xl rotate-6 shadow-lg shadow-amber-500/20" />
                <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0f] font-black text-lg lg:text-xl">C</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black text-amber-100">Creebs</h1>
                <p className="text-amber-200/40 text-[10px] lg:text-xs font-medium tracking-wider uppercase">Property Manager</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 lg:space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-400/30 text-amber-100 shadow-lg shadow-amber-500/10"
                      : "text-amber-200/50 hover:text-amber-200/80 hover:bg-amber-400/5 border border-transparent"
                  }`}
                >
                  <span className="text-lg lg:text-xl">{tab.icon}</span>
                  <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                  {tab.id === "repairs" && stats && stats.pendingRepairs > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-400 rounded-full">
                      {stats.pendingRepairs}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Quick stats */}
            {stats && (
              <div className="mt-6 p-4 bg-[#0a0a0f]/40 rounded-xl border border-amber-400/10">
                <h3 className="text-amber-200/50 text-[10px] lg:text-xs font-medium tracking-wider uppercase mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-amber-200/40">Properties</span>
                    <span className="text-amber-100 font-semibold">{stats.totalProperties}</span>
                  </div>
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-amber-200/40">Occupancy</span>
                    <span className="text-amber-100 font-semibold">{stats.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-amber-200/40">Active Repairs</span>
                    <span className="text-amber-100 font-semibold">{stats.pendingRepairs + stats.inProgressRepairs}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sign out */}
            <button
              onClick={() => signOut()}
              className="hidden lg:flex mt-4 items-center gap-2 px-4 py-3 text-amber-200/40 hover:text-amber-200/70 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" && <OverviewPanel />}
            {activeTab === "properties" && <PropertiesPanel />}
            {activeTab === "repairs" && <RepairsPanel />}
            {activeTab === "tenants" && <TenantsPanel />}
            {activeTab === "finances" && <TransactionsPanel />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-amber-400/5">
        <p className="text-amber-200/20 text-[10px] sm:text-xs font-light tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
