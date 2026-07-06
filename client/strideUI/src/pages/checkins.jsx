import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getTodayCheckins, updateCheckin } from "../services/checkinsAPI.js";

export default function Checkins() {
  const [checkins, setCheckins] = useState([]);

  // 📌 Load today's checkins
  const loadCheckins = async () => {
    const data = await getTodayCheckins();
    setCheckins(data);
  };

  useEffect(() => {
    loadCheckins();
  }, []);

  // 📌 Update status
  const handleUpdate = async (id, status) => {
    await updateCheckin(id, status);
    loadCheckins();
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Today's Check-ins</h1>

      <div className="space-y-3">
        {checkins.length === 0 && (
          <p className="text-gray-500">No check-ins for today</p>
        )}

        {checkins.map((c) => (
          <div
            key={c.id}
            className="bg-gray-900 p-4 rounded flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <p className="font-medium">{c.goal_title}</p>
              <p className="text-xs text-gray-500">Status: {c.status}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(c.id, "complete")}
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Complete
              </button>

              <button
                onClick={() => handleUpdate(c.id, "miss")}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Miss
              </button>

              <button
                onClick={() => handleUpdate(c.id, "skip")}
                className="bg-gray-700 px-3 py-1 rounded text-sm"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
