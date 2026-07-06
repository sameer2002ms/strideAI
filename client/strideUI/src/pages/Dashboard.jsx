import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h2 className="text-gray-400">Active Goals</h2>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <h2 className="text-gray-400">Today's Check-ins</h2>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <h2 className="text-gray-400">Telegram Status</h2>
          <p className="text-2xl font-bold">Not Linked</p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-6 bg-gray-900 p-4 rounded-xl">
        <h2 className="text-gray-400 mb-2">Recent Activity</h2>
        <p className="text-sm text-gray-500">No activity yet</p>
      </div>
    </DashboardLayout>
  );
}
