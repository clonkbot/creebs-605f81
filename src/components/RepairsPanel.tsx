import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Priority = "low" | "medium" | "high" | "urgent";
type Status = "pending" | "in_progress" | "completed" | "cancelled";
type Category = "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "pest" | "other";

type PropertyItem = {
  _id: Id<"properties">;
  name: string;
};

type RepairItem = {
  _id: Id<"repairs">;
  propertyId: Id<"properties">;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: Category;
  estimatedCost?: number;
  createdAt: number;
};

export function RepairsPanel() {
  const repairs = useQuery(api.repairs.list);
  const properties = useQuery(api.properties.list);
  const createRepair = useMutation(api.repairs.create);
  const updateRepairStatus = useMutation(api.repairs.updateStatus);
  const removeRepair = useMutation(api.repairs.remove);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [formData, setFormData] = useState({
    propertyId: "" as string,
    title: "",
    description: "",
    priority: "medium" as Priority,
    category: "other" as Category,
    estimatedCost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId) return;
    await createRepair({
      propertyId: formData.propertyId as Id<"properties">,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      estimatedCost: formData.estimatedCost || undefined,
    });
    setFormData({
      propertyId: "",
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      estimatedCost: 0,
    });
    setShowForm(false);
  };

  const handleStatusChange = async (id: Id<"repairs">, status: Status) => {
    await updateRepairStatus({ id, status });
  };

  const handleDelete = async (id: Id<"repairs">) => {
    if (confirm("Are you sure you want to delete this repair?")) {
      await removeRepair({ id });
    }
  };

  const priorityColors: Record<Priority, string> = {
    low: "bg-gray-500/20 text-gray-400 border-gray-400/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-400/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    urgent: "bg-red-500/20 text-red-400 border-red-400/30",
  };

  const statusColors: Record<Status, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    completed: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-gray-500/20 text-gray-400",
  };

  const categoryIcons: Record<Category, string> = {
    plumbing: "🚿",
    electrical: "⚡",
    hvac: "❄️",
    appliance: "🔌",
    structural: "🏗️",
    pest: "🐛",
    other: "🔧",
  };

  const filteredRepairs = repairs?.filter(
    (r: RepairItem) => filter === "all" || r.status === filter
  );

  const getPropertyName = (propertyId: Id<"properties">) => {
    return properties?.find((p: PropertyItem) => p._id === propertyId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-amber-100 mb-2">Repairs & Maintenance</h1>
          <p className="text-amber-200/50 text-sm">Track and manage all repair requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!properties || properties.length === 0}
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {showForm ? "Cancel" : "+ New Repair"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "in_progress", "completed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
              filter === status
                ? "bg-amber-500/20 text-amber-100 border border-amber-400/30"
                : "text-amber-200/50 hover:text-amber-200/80 border border-transparent hover:border-amber-400/10"
            }`}
          >
            {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Add repair form */}
      {showForm && properties && properties.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-amber-100 mb-4">New Repair Request</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <option value="plumbing">🚿 Plumbing</option>
                <option value="electrical">⚡ Electrical</option>
                <option value="hvac">❄️ HVAC</option>
                <option value="appliance">🔌 Appliance</option>
                <option value="structural">🏗️ Structural</option>
                <option value="pest">🐛 Pest Control</option>
                <option value="other">🔧 Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Leaky faucet in master bathroom"
              className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Estimated Cost ($)</label>
              <input
                type="number"
                min="0"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Create Repair Request
          </button>
        </form>
      )}

      {/* Repairs list */}
      {repairs === undefined ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : !properties || properties.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">Add a property first</h3>
          <p className="text-amber-200/50">You need at least one property to create repair requests</p>
        </div>
      ) : filteredRepairs?.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">No repairs found</h3>
          <p className="text-amber-200/50">
            {filter === "all" ? "Create your first repair request" : `No ${filter.replace("_", " ")} repairs`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRepairs?.map((repair: RepairItem) => (
            <div
              key={repair._id}
              className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-4 sm:p-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-2xl">
                  {categoryIcons[repair.category]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-amber-100 font-bold">{repair.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${priorityColors[repair.priority]}`}>
                      {repair.priority}
                    </span>
                  </div>

                  <p className="text-amber-200/60 text-sm mb-3 line-clamp-2">{repair.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/40">
                    <span>📍 {getPropertyName(repair.propertyId)}</span>
                    <span>📂 {repair.category}</span>
                    {repair.estimatedCost && <span>💰 ${repair.estimatedCost.toLocaleString()}</span>}
                    <span>📅 {new Date(repair.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={repair.status}
                    onChange={(e) => handleStatusChange(repair._id, e.target.value as Status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg ${statusColors[repair.status]} border-0 focus:outline-none cursor-pointer`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDelete(repair._id)}
                    className="p-2 text-amber-200/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
