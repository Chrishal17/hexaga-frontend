import { useEffect, useState } from "react";
import api from "../services/api";
import clsx from "clsx";
import {
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Server,
  Shield,
  Database,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("emergencies");
  const [emergencies, setEmergencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cpu: 12, memory: 34, db: "Healthy" });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "emergencies") {
        const { data } = await api.get("/emergencies");
        setEmergencies(data);
      } else if (activeTab === "patients") {
        const { data } = await api.get("/auth/users");
        setUsers(data);
      }
      // Mock system stats update
      setStats((prev) => ({
        cpu: Math.floor(Math.random() * 20) + 10,
        memory: Math.floor(Math.random() * 10) + 30,
        db: "Healthy",
      }));
    } catch (error) {
      console.error(error);
      // Don't spam toasts on polling
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/emergencies/${id}/status`, { status });
      addToast(`Status updated to ${status}`, "success");
      fetchData();
    } catch (error) {
      console.error(error);
      addToast("Failed to update status", "error");
    }
  };

  // Card Component for iPad feel
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className={clsx("p-3 rounded-xl bg-opacity-10", color)}>
          <Icon className={clsx("w-6 h-6", color.replace("bg-", "text-"))} />
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Metric
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* iPad-style Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-indigo-600" />
            Admin Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time monitoring & patient management
          </p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl">
          {["emergencies", "patients", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                activeTab === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {/* System Stats Overview Row (Visible on all tabs for quick check) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Emergencies"
            value={emergencies.filter((e) => e.status === "pending").length}
            icon={AlertTriangle}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title="Registered Users"
            value={users.length || "--"}
            icon={Users}
            color="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            title="Server CPU Load"
            value={`${stats.cpu}%`}
            icon={Server}
            color="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            title="DB Health"
            value={stats.db}
            icon={Database}
            color="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Content Area */}
        {activeTab === "emergencies" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                Critical Incidents
              </h2>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Patient Details
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Incident
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {emergencies.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border",
                            e.severity === "critical"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-orange-50 text-orange-700 border-orange-100"
                          )}
                        >
                          {e.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                            {e.users?.full_name?.[0] || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {e.users?.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {e.users?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 max-w-xs truncate">
                          {e.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(e.created_at).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={clsx(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            e.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : e.status === "acknowledged"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {e.status !== "resolved" && (
                            <button
                              onClick={() => updateStatus(e.id, "resolved")}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition-all shadow-sm hover:shadow-md"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                Patient Directory
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                            {u.full_name?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {u.full_name}
                            </p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="grid md:grid-cols-2 gap-8 animate-slide-in">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Server className="mr-3 text-emerald-400" /> System Health
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-slate-400">
                    <span>CPU Usage</span>
                    <span>{stats.cpu}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${stats.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-slate-400">
                    <span>Memory Load</span>
                    <span>{stats.memory}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${stats.memory}%` }}
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    All Systems Operational
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                Security Logs
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Admin login detected
                      </p>
                      <p className="text-xs text-slate-400">
                        IP: 192.168.1.{10 + i} • {i * 5} mins ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
