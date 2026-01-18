import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const Remedies = () => {
  const [remedies, setRemedies] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemedies();
  }, [search]); // Simple debounce could be added here

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/remedies?search=${search}`);
      setRemedies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
          Natural Remedies
        </h1>
        <p className="text-slate-500 mb-6">
          Explore validated natural solutions for common ailments.
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search remedies (e.g., headache, ginger)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">
          Loading knowledge base...
        </div>
      ) : (
        <div className="grid gap-4">
          {remedies.map((remedy) => (
            <div
              key={remedy.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleExpand(remedy.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {remedy.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {remedy.description}
                  </p>
                </div>
                {expandedId === remedy.id ? (
                  <ChevronUp className="text-slate-400" />
                ) : (
                  <ChevronDown className="text-slate-400" />
                )}
              </button>

              {expandedId === remedy.id && (
                <div className="px-6 pb-6 pt-0 border-t border-slate-50 bg-slate-50/50">
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">
                        Ingredients
                      </h4>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {remedy.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">
                        Benefits
                      </h4>
                      <p className="text-slate-600">{remedy.benefits}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-medium text-slate-700 mb-2">
                      Preparation
                    </h4>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {remedy.preparation_steps}
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm border border-amber-100">
                    <strong>⚠️ Warning:</strong> {remedy.warnings}
                  </div>
                </div>
              )}
            </div>
          ))}
          {remedies.length === 0 && !loading && (
            <div className="text-center py-10 text-slate-500">
              No remedies found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Remedies;
