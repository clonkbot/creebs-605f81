import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type TransactionType = "rent_income" | "repair_expense" | "maintenance_expense" | "utility_expense" | "other_income" | "other_expense";

type PropertyItem = {
  _id: Id<"properties">;
  name: string;
};

type TransactionItem = {
  _id: Id<"transactions">;
  propertyId?: Id<"properties">;
  type: TransactionType;
  amount: number;
  description: string;
  date: number;
};

export function TransactionsPanel() {
  const transactions = useQuery(api.transactions.list);
  const properties = useQuery(api.properties.list);
  const stats = useQuery(api.stats.getDashboardStats);
  const createTransaction = useMutation(api.transactions.create);
  const removeTransaction = useMutation(api.transactions.remove);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [formData, setFormData] = useState({
    propertyId: "" as string,
    type: "rent_income" as TransactionType,
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTransaction({
      propertyId: formData.propertyId ? formData.propertyId as Id<"properties"> : undefined,
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
      date: new Date(formData.date).getTime(),
    });
    setFormData({
      propertyId: "",
      type: "rent_income",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
  };

  const handleDelete = async (id: Id<"transactions">) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await removeTransaction({ id });
    }
  };

  const typeLabels: Record<TransactionType, { label: string; icon: string; color: string }> = {
    rent_income: { label: "Rent Income", icon: "🏠", color: "text-emerald-400" },
    repair_expense: { label: "Repair", icon: "🔧", color: "text-red-400" },
    maintenance_expense: { label: "Maintenance", icon: "🧹", color: "text-red-400" },
    utility_expense: { label: "Utility", icon: "💡", color: "text-red-400" },
    other_income: { label: "Other Income", icon: "💰", color: "text-emerald-400" },
    other_expense: { label: "Other Expense", icon: "📤", color: "text-red-400" },
  };

  const getPropertyName = (propertyId: Id<"properties"> | undefined) => {
    if (!propertyId) return "General";
    return properties?.find((p: PropertyItem) => p._id === propertyId)?.name || "Unknown";
  };

  const filteredTransactions = transactions?.filter((t: TransactionItem) => {
    if (filter === "all") return true;
    if (filter === "income") return t.type.includes("income");
    return t.type.includes("expense");
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-amber-100 mb-2">Finances</h1>
          <p className="text-amber-200/50 text-sm">Track income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base"
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {/* Summary cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 rounded-xl border border-emerald-400/20 p-4 sm:p-5">
            <p className="text-emerald-200/60 text-xs font-medium tracking-wider uppercase mb-2">Total Income</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">${stats.totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-red-500/10 rounded-xl border border-red-400/20 p-4 sm:p-5">
            <p className="text-red-200/60 text-xs font-medium tracking-wider uppercase mb-2">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-black text-red-400">${stats.totalExpenses.toLocaleString()}</p>
          </div>
          <div className={`rounded-xl border p-4 sm:p-5 ${
            stats.netIncome >= 0
              ? "bg-emerald-500/10 border-emerald-400/20"
              : "bg-red-500/10 border-red-400/20"
          }`}>
            <p className={`text-xs font-medium tracking-wider uppercase mb-2 ${
              stats.netIncome >= 0 ? "text-emerald-200/60" : "text-red-200/60"
            }`}>Net Income</p>
            <p className={`text-2xl sm:text-3xl font-black ${
              stats.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
            }`}>
              {stats.netIncome >= 0 ? "" : "-"}${Math.abs(stats.netIncome).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "income", "expense"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
              filter === f
                ? "bg-amber-500/20 text-amber-100 border border-amber-400/30"
                : "text-amber-200/50 hover:text-amber-200/80 border border-transparent hover:border-amber-400/10"
            }`}
          >
            {f === "all" ? "All Transactions" : f === "income" ? "Income" : "Expenses"}
          </button>
        ))}
      </div>

      {/* Add transaction form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-amber-100 mb-4">New Transaction</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <optgroup label="Income">
                  <option value="rent_income">🏠 Rent Income</option>
                  <option value="other_income">💰 Other Income</option>
                </optgroup>
                <optgroup label="Expenses">
                  <option value="repair_expense">🔧 Repair Expense</option>
                  <option value="maintenance_expense">🧹 Maintenance Expense</option>
                  <option value="utility_expense">💡 Utility Expense</option>
                  <option value="other_expense">📤 Other Expense</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Property (Optional)</label>
              <select
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <option value="">General (No specific property)</option>
                {properties?.map((p: PropertyItem) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Monthly rent payment from John"
              className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Transaction
          </button>
        </form>
      )}

      {/* Transactions list */}
      {transactions === undefined ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : filteredTransactions?.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">No transactions yet</h3>
          <p className="text-amber-200/50 mb-6">Start tracking your income and expenses</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Your First Transaction
          </button>
        </div>
      ) : (
        <div className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-amber-400/10">
                  <th className="text-left text-amber-200/50 text-xs font-medium tracking-wider uppercase px-4 sm:px-6 py-4">Date</th>
                  <th className="text-left text-amber-200/50 text-xs font-medium tracking-wider uppercase px-4 sm:px-6 py-4">Description</th>
                  <th className="text-left text-amber-200/50 text-xs font-medium tracking-wider uppercase px-4 sm:px-6 py-4">Property</th>
                  <th className="text-left text-amber-200/50 text-xs font-medium tracking-wider uppercase px-4 sm:px-6 py-4">Type</th>
                  <th className="text-right text-amber-200/50 text-xs font-medium tracking-wider uppercase px-4 sm:px-6 py-4">Amount</th>
                  <th className="px-4 sm:px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions?.map((transaction: TransactionItem) => {
                  const typeInfo = typeLabels[transaction.type];
                  const isIncome = transaction.type.includes("income");

                  return (
                    <tr key={transaction._id} className="border-b border-amber-400/5 hover:bg-amber-400/5 transition-colors group">
                      <td className="px-4 sm:px-6 py-4 text-amber-200/60 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-amber-100 text-sm font-medium">
                        {transaction.description}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-amber-200/50 text-sm">
                        {getPropertyName(transaction.propertyId)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span>{typeInfo.icon}</span>
                          <span className={typeInfo.color}>{typeInfo.label}</span>
                        </span>
                      </td>
                      <td className={`px-4 sm:px-6 py-4 text-right font-bold text-sm ${
                        isIncome ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {isIncome ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-2 text-amber-200/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
