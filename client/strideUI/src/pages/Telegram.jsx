import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  createTelegramLink,
  getTelegramStatus,
} from "../services/telegramAPI.js";

const TELEGRAM_BOT_USERNAME =
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "Stride_AIbot";

function extractErrorMessage(err) {
  const data = err?.response?.data;

  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  const firstVal = data?.[firstKey];

  if (Array.isArray(firstVal)) {
    return `${firstKey}: ${firstVal[0]}`;
  }

  return "Something went wrong. Please try again.";
}

export default function Telegram() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telegramStatus, setTelegramStatus] = useState(null);

  const refreshStatus = useCallback(async () => {
    try {
      setError(null);

      const status = await getTelegramStatus();
      setTelegramStatus(status);

      // If account becomes linked, token is no longer needed
      if (status?.linked) {
        setToken(null);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    // Stop polling if:
    // 1. no token exists
    // 2. Telegram is already linked
    if (!token || telegramStatus?.linked) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      refreshStatus();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [refreshStatus, telegramStatus?.linked, token]);

  const handleGenerate = async () => {
    // Frontend protection:
    // Never generate another token if already linked
    if (telegramStatus?.linked) {
      setError("Your Telegram account is already linked.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createTelegramLink();
      setToken(res.token);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isLinked = telegramStatus?.linked === true;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Telegram Integration
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Connect your account for reminders and check-ins on the go.
          </p>
        </div>

        {/* STATUS CARD */}
        <div className="bg-gray-900 border border-slate-200 p-5 rounded-2xl mb-4">
          <h2 className="text-gray-400">Status</h2>

          <p
            className={`text-lg ${
              isLinked ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {statusLoading
              ? "Checking..."
              : isLinked
                ? `Linked${
                    telegramStatus?.username
                      ? ` as @${telegramStatus.username}`
                      : ""
                  }`
                : "Not linked"}
          </p>

          <button
            type="button"
            onClick={refreshStatus}
            disabled={statusLoading}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            {statusLoading ? "Checking..." : "Refresh status"}
          </button>
        </div>

        {/* TELEGRAM LINKING CARD */}
        <div className="bg-gray-900 border border-slate-200 p-5 rounded-2xl">
          <h2 className="text-gray-400 mb-2">Link your Telegram</h2>

          {isLinked ? (
            /* ALREADY LINKED STATE */
            <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 font-semibold">
                Your Telegram account is already linked.
              </p>

              {telegramStatus?.username && (
                <p className="text-sm text-gray-400 mt-1">
                  Connected as @{telegramStatus.username}
                </p>
              )}

              <p className="text-sm text-gray-400 mt-2">
                You can now use StrideAI directly from Telegram.
              </p>
            </div>
          ) : (
            /* NOT LINKED STATE */
            <>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || statusLoading}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generating..." : "Generate Link Token"}
              </button>

              {token && (
                <div className="mt-4 p-4 bg-gray-800 rounded-xl">
                  <p className="text-sm text-gray-400">
                    Send this command directly in Telegram chat:
                  </p>

                  <div className="mt-3 p-3 bg-gray-950 rounded-lg border border-gray-700">
                    <p className="text-green-400 font-mono break-all">
                      /link {token}
                    </p>
                  </div>

                  <a
                    href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(
                      token,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-xl font-medium"
                  >
                    Open Telegram and connect
                  </a>

                  <p className="text-sm text-yellow-300 mt-3">
                    Waiting for confirmation from Telegram…
                  </p>
                </div>
              )}
            </>
          )}

          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </div>

        {/* INSTRUCTIONS */}
        {!isLinked && (
          <div className="mt-4 bg-gray-900 border border-slate-200 p-5 rounded-2xl">
            <h2 className="text-gray-400 mb-2">How it works</h2>

            <ul className="text-sm text-gray-300 space-y-1">
              <li>1. Click “Generate Link Token”</li>
              <li>2. Open Telegram bot</li>
              <li>3. Send /link {"<token>"} directly in chat</li>
              <li>4. Your account will be linked automatically</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
