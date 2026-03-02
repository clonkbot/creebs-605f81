import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type PropertyType = "house" | "apartment" | "condo" | "townhouse";

type PropertyItem = {
  _id: Id<"properties">;
  name: string;
  address: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent?: number;
};

export function PropertiesPanel() {
  const properties = useQuery(api.properties.list);
  const createProperty = useMutation(api.properties.create);
  const removeProperty = useMutation(api.properties.remove);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "house" as PropertyType,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 1000,
    monthlyRent: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProperty({
      ...formData,
      monthlyRent: formData.monthlyRent || undefined,
    });
    setFormData({
      name: "",
      address: "",
      type: "house",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 1000,
      monthlyRent: 0,
    });
    setShowForm(false);
  };

  const handleDelete = async (id: Id<"properties">) => {
    if (confirm("Are you sure you want to delete this property?")) {
      await removeProperty({ id });
    }
  };

  const propertyTypeIcons: Record<PropertyType, string> = {
    house: "🏠",
    apartment: "🏢",
    condo: "🏙️",
    townhouse: "🏘️",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-amber-100 mb-2">Properties</h1>
          <p className="text-amber-200/50 text-sm">Manage your real estate portfolio</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base"
        >
          {showForm ? "Cancel" : "+ Add Property"}
        </button>
      </div>

      {/* Add property form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-amber-100 mb-4">New Property</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Property Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sunset Villa"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, City, State 12345"
              className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Sq. Feet</label>
              <input
                type="number"
                min="0"
                required
                value={formData.squareFeet}
                onChange={(e) => setFormData({ ...formData, squareFeet: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-amber-200/70 text-xs font-medium tracking-wider uppercase mb-2">Monthly Rent</label>
              <input
                type="number"
                min="0"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                placeholder="$0"
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Property
          </button>
        </form>
      )}

      {/* Properties grid */}
      {properties === undefined ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a]/30 rounded-2xl border border-amber-400/10">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">No properties yet</h3>
          <p className="text-amber-200/50 mb-6">Add your first property to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.map((property: PropertyItem) => (
            <div
              key={property._id}
              className="bg-[#12121a]/50 rounded-2xl border border-amber-400/10 p-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-2xl">
                    {propertyTypeIcons[property.type]}
                  </div>
                  <div>
                    <h3 className="text-amber-100 font-bold">{property.name}</h3>
                    <span className="text-amber-200/40 text-xs capitalize">{property.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="p-2 text-amber-200/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <p className="text-amber-200/60 text-sm mb-4 truncate">{property.address}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-[#0a0a0f]/40 rounded-lg">
                  <p className="text-amber-100 font-bold">{property.bedrooms}</p>
                  <p className="text-amber-200/40 text-[10px] uppercase">Beds</p>
                </div>
                <div className="text-center p-2 bg-[#0a0a0f]/40 rounded-lg">
                  <p className="text-amber-100 font-bold">{property.bathrooms}</p>
                  <p className="text-amber-200/40 text-[10px] uppercase">Baths</p>
                </div>
                <div className="text-center p-2 bg-[#0a0a0f]/40 rounded-lg">
                  <p className="text-amber-100 font-bold">{property.squareFeet.toLocaleString()}</p>
                  <p className="text-amber-200/40 text-[10px] uppercase">Sq Ft</p>
                </div>
              </div>

              {property.monthlyRent && (
                <div className="pt-4 border-t border-amber-400/10">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-200/50 text-sm">Monthly Rent</span>
                    <span className="text-emerald-400 font-bold text-lg">${property.monthlyRent.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
