import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { createTelegramLink } from "../services/telegramAPI.js";

// 📌 Surfaces DRF validation errors without introducing a new error component
function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstVal = data?.[firstKey];
  if (Array.isArray(firstVal)) return `${firstKey}: ${firstVal[0]}`;
  return "Something went wrong. Please try again.";
}

export default function Telegram() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await createTelegramLink();
      setToken(res.token);
    } catch (err) {
      setError(extractErrorMessage(err));
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Telegram Integration</h1>

      {/* STATUS CARD */}
      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <h2 className="text-gray-400">Status</h2>
        <p className="text-lg text-yellow-400">
          Not Linked (or fetch from backend later)
        </p>
      </div>

      {/* TOKEN GENERATION */}
      <div className="bg-gray-900 p-4 rounded-xl">
        <h2 className="text-gray-400 mb-2">Link your Telegram</h2>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Link Token"}
        </button>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

        {token && (
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <p className="text-sm text-gray-400">
              Send this command in Telegram:
            </p>
            <p className="text-green-400 font-mono mt-2">/link {token}</p>
          </div>
        )}
      </div>

      {/* INSTRUCTIONS */}
      <div className="mt-4 bg-gray-900 p-4 rounded-xl">
        <h2 className="text-gray-400 mb-2">How it works</h2>

        <ul className="text-sm text-gray-300 space-y-1">
          <li>1. Click “Generate Link Token”</li>
          <li>2. Open Telegram bot</li>
          <li>3. Send /link {"<token>"}</li>
          <li>4. Your account will be linked automatically</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
