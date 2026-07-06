import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getGoals, createGoal, deleteGoal } from "../services/goalsApi.js";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");

  // 📌 Load goals
  const loadGoals = async () => {
    const data = await getGoals();
    setGoals(data);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // 📌 Create goal
  const handleCreate = async () => {
    if (!title) return;

    await createGoal({ title });
    setTitle("");
    loadGoals();
  };

  // 📌 Delete goal
  const handleDelete = async (id) => {
    await deleteGoal(id);
    loadGoals();
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Goals</h1>

      {/* CREATE GOAL */}
      <div className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 bg-gray-900 rounded"
          placeholder="Enter new goal"
        />
        <button onClick={handleCreate} className="bg-blue-600 px-4 rounded">
          Add
        </button>
      </div>

      {/* GOALS LIST */}
      <div className="space-y-3">
        {goals.length === 0 && <p className="text-gray-500">No goals yet</p>}

        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex justify-between items-center bg-gray-900 p-3 rounded"
          >
            <div>
              <p className="font-medium">{goal.title}</p>
              <p className="text-xs text-gray-500">
                Status: {goal.status || "active"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(goal.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
