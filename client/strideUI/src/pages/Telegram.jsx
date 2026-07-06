import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { generateTelegramToken } from "../services/telegramAPI";

export default function Telegram() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await generateTelegramToken();
      setToken(res.token);
    } catch (err) {
      console.error(err);
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
          className="bg-blue-600 px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Link Token"}
        </button>

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
