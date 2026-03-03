"use client";
import React, { useState } from "react";
import { Shield, Bell, LogOut, Users, Truck, Ship, Activity, AlertTriangle, Package, TrendingUp, MapPin, CheckCircle, X, BarChart3, Plane, } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useUserContext } from "@/context/UserContext";
import { useDisasterContext } from "@/context/DisasterContext";
import { useSocektContext } from "@/context/SocketContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Dashboard() {
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useUserContext();
  const { alertOccurred, updateAlertStatus, alertData, savePredictedResources, predictedResources, } = useDisasterContext();
  const { socket } = useSocektContext();

  // Temporary data for visualizations
  const disasterTrendsData = [
    { month: "Jan", incidents: 12, affected: 2400 },
    { month: "Feb", incidents: 19, affected: 1398 },
    { month: "Mar", incidents: 15, affected: 3800 },
    { month: "Apr", incidents: 25, affected: 3908 },
    { month: "May", incidents: 22, affected: 4800 },
    { month: "Jun", incidents: 30, affected: 3800 },
  ];

  const resourceDistributionData = [
    { name: "Rescue Boats", value: user?.rescueBoats || 10, color: "#3b82f6" },
    { name: "Ambulances", value: user?.ambulances || 8, color: "#ef4444" },
    {
      name: "Supply Trucks",
      value: user?.supplyTrucks || 12,
      color: "#f97316",
    },
    {
      name: "Team Members",
      value: user?.humanRescueTeamSize,
      color: "#10b981",
    },
  ];

  const regionalDataTemp = [
    { region: "North", alerts: 15, resources: 85 },
    { region: "South", alerts: 22, resources: 92 },
    { region: "East", alerts: 18, resources: 78 },
    { region: "West", alerts: 12, resources: 88 },
  ];

  const handleAcknowledge = async () => {
    setLoading(true);
    const toastId = toast.loading("Processing disaster alert...");
    try {
      const response = await fetch("/api/alert/resourcePrediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disasterEventId: alertData?.disasterId,
          userId: user?._id,
          geoCode: user?.centralRegionGeoCode,
        }),
      });

      if (!response.ok ) {
        const ErrResponse = await response.json();
        throw new Error(ErrResponse.error);
      }

      const { data, message } = await response.json();

      if (response.status === 202) {
        toast.success(message);

        setAlertAcknowledged(true);
        updateAlertStatus();
        setLoading(false);

        return;
      }

      if (response.status === 200) {
        toast.success("Resource prediction completed!", {
          id: toastId,
        });
        savePredictedResources({
          disaster: {
            type: "Flood",
            severity: "High",
            region: user?.regionName || "sujanagar",
            civiliansToEvacuate: data?.predictedResources?.civiliansToEvacuate,
          },
          resources: {
            rescueBoats: data?.predictedResources?.rescueBoats,
            ambulances: data?.predictedResources?.ambulances,
            humanRescueTeams: data?.predictedResources?.humanRescueTeams,
            supplyTrucks: data?.predictedResources?.supplyTrucks,
            shelterTents: data?.predictedResources?.shelterCount,
            drones: data?.predictedResources?.drones,
          },
          resourcePlanId:data?._id,
          timeline: "24-48 hours",
          priority: "Critical",
        });

        setAlertAcknowledged(true);
        updateAlertStatus();
        setLoading(false);

        if (!socket) {
          console.log(
            "Broadcasting page::handleAcknowledgment():: socekt instance not found"
          );
          throw new Error(
            "Broadcasting to other members of same region Failed"
          );
        } else if (predictedResources !== null) {
          console.log("The predicted results are: ",predictedResources);
          socket.emit("prediction-complete", predictedResources);
        } 
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process alert", {
        id: toastId,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Alert Modal */}
      {alertOccurred && !alertAcknowledged && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-pulse">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Disaster Alert Detected!
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Type:</strong>{" "}
                {`Severe ${alertData?.disasterName} Warning`}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Region:</strong> {user?.regionName}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Severity:</strong>{" "}
                <span className="text-red-600 font-semibold">HIGH</span>
              </p>
              <p className="text-gray-600 mb-6">
                <strong>Estimated Impact:</strong> 15,000+ people affected
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ IMD has issued a severe weather alert. Immediate action
                  required. Click acknowledge to begin resource prediction and
                  allocation.
                </p>
              </div>

              <button
                onClick={handleAcknowledge}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Acknowledge & Start Prediction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Guardian Eye Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Disaster Management Control Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.teamName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.regionName}</p>
                </div>

                {/* Profile Image */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={
                      user?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/9205/9205233.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <button className="p-2 text-gray-600 hover:text-red-600 transition">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.rescueBoats}
            </h3>
            <p className="text-sm text-gray-600">Rescue Boats Available</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.ambulances}
            </h3>
            <p className="text-sm text-gray-600">Ambulances Ready</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.humanRescueTeamSize}
            </h3>
            <p className="text-sm text-gray-600">Team Members</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.supplyTrucks}
            </h3>
            <p className="text-sm text-gray-600">Supply Trucks</p>
          </div>
        </div>

        {/* Predicted Resources Section */}
        {predictedResources && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Predicted Resource Requirements
                </h2>
                <p className="text-sm text-gray-600">
                  Based on {predictedResources.disaster.type} severity in{" "}
                  {predictedResources.disaster.region}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Disaster Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900">
                      {predictedResources.disaster.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Severity:</span>
                    <span className="font-semibold text-red-600">
                      {predictedResources.disaster.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-semibold text-gray-900">
                      {predictedResources.disaster.region}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Civilians to Evacuate:
                    </span>
                    <span className="font-semibold text-gray-900">
                        {predictedResources.disaster.civiliansToEvacuate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Deployment Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-semibold text-gray-900">
                      {predictedResources.timeline}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-semibold text-red-600">
                      {predictedResources.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600">
                      Ready for Deployment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4">Required Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <Ship className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.rescueBoats}
                </div>
                <div className="text-xs text-gray-600">Rescue Boats</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.ambulances}
                </div>
                <div className="text-xs text-gray-600">Ambulances</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.humanRescueTeams}
                </div>
                <div className="text-xs text-gray-600">Human Rescue Teams</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.supplyTrucks}
                </div>
                <div className="text-xs text-gray-600">Supply Trucks</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <MapPin className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.shelterTents}
                </div>
                <div className="text-xs text-gray-600">Shelter Tents</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Plane className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {predictedResources.resources.drones}
                </div>
                <div className="text-xs text-gray-600">Drones</div>
              </div>
            </div>
          </div>
        )}

        {/* Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Disaster Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Disaster Trends (6 Months)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={disasterTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="affected"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Resource Distribution
              </h3>
            </div>
            {user ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resourceDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resourceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src="https://thumbs.dreamstime.com/b/business-continuity-disaster-recovery-231590771.jpg"
                  alt="Business continuity and disaster recovery"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Regional Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Regional Alert & Resource Status
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalDataTemp}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="#ef4444" />
                <Bar dataKey="resources" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">
                View Alerts
              </div>
            </button>
            <Link href="/evacuationMap" className="block">
            <button className="p-4 w-full border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">
                Evacuation Routes
              </div>
            </button>
            </Link>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">
                Manage Resources
              </div>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">
                Team Coordination
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
