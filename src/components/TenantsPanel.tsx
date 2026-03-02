import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type PropertyItem = {
  _id: Id<"properties">;
  name: string;
};

type TenantItem = {
  _id: Id<"tenants">;
  propertyId: Id<"properties">;
  name: string;
  email: string;
  phone: string;
  leaseStart: number;
  leaseEnd: number;
  rentAmount: number;
};

export function TenantsPanel() {
  const tenants = useQuery(api.tenants.list);
  const properties = useQuery(api.properties.list);
  const createTenant = useMutation(api.tenants.create);
  const removeTenant = useMutation(api.tenants.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: "" as string,
    name: "",
    email: "",
    phone: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId) return;
    await createTenant({
      propertyId: formData.propertyId as Id<"properties">,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      leaseStart: new Date(formData.leaseStart).getTime(),
      leaseEnd: new Date(formData.leaseEnd).getTime(),
      rentAmount: formData.rentAmount,
    });
    setFormData({
      propertyId: "",
      name: "",
      email: "",
      phone: "",
      leaseStart: "",
      leaseEnd: "",
      rentAmount: 0,
    });
    setShowForm(false);
  };

  const handleDelete = async (id: Id<"tenants">) => {
    if (confirm("Are you sure you want to remove this tenant?")) {
      await removeTenant({ id });
    }
  };

  const getPropertyName = (propertyId: Id<"properties">) => {
    return properties?.find((p: PropertyItem) => p._id === propertyId)?.name || "Unknown";
  };

  const isLeaseActive = (leaseEnd: number) => {
    return leaseEnd > Date.now();
  };

  const daysUntilLeaseEnd = (leaseEnd: number) => {
    const days = Math.ceil((leaseEnd - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-amber-100 mb-2">Tenants</h1>
          <p className="text-amber-200/50 text-sm">Manage your tenants and leases</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!properties || properties.length === 0}
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {showForm ? "Cancel" : "+ Add Tenant"}
        </button>
      </div>

      {/* Add tenant form */}
      {showForm && properties && properties.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-amber-100 mb-4">New Tenant</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Property</label>
              <select
                required
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <option value="">Select property...</option>
                {properties.map((p: PropertyItem) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Lease Start</label>
              <input
                type="date"
                required
                value={formData.leaseStart}
                onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Lease End</label>
              <input
                type="date"
                required
                value={formData.leaseEnd}
                onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Monthly Rent ($)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: parseInt(e.target.value) || 0 })}
                placeholder="1500"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Tenant
          </button>
        </form>
      )}

      {/* Tenants list */}
      {tenants === undefined ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : !properties || properties.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">Add a property first</h3>
          <p className="text-amber-200/50">You need at least one property to add tenants</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">No tenants yet</h3>
          <p className="text-amber-200/50 mb-6">Add your first tenant to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Your First Tenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map((tenant: TenantItem) => {
            const active = isLeaseActive(tenant.leaseEnd);
            const daysLeft = daysUntilLeaseEnd(tenant.leaseEnd);

            return (
              <div
                key={tenant._id}
                className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-5 hover:border-amber-400/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center text-xl font-bold text-amber-200">
                      {tenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-amber-100 font-bold">{tenant.name}</h3>
                      <p className="text-amber-200/40 text-xs">📍 {getPropertyName(tenant.propertyId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${
                      active
                        ? daysLeft <= 30
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {active ? (daysLeft <= 30 ? `${daysLeft}d left` : "Active") : "Expired"}
                    </span>
                    <button
                      onClick={() => handleDelete(tenant._id)}
                      className="p-2 text-amber-200/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-amber-200/60">
                    <span>📧</span>
                    <a href={`mailto:${tenant.email}`} className="hover:text-amber-200 transition-colors truncate">
                      {tenant.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-200/60">
                    <span>📱</span>
                    <a href={`tel:${tenant.phone}`} className="hover:text-amber-200 transition-colors">
                      {tenant.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/10 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-200/40 text-[10px] uppercase mb-1">Lease Period</p>
                    <p className="text-amber-100 text-sm">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-200/40 text-[10px] uppercase mb-1">Monthly Rent</p>
                    <p className="text-emerald-400 font-bold text-lg">${tenant.rentAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
