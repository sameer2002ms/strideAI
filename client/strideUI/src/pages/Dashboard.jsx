
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getGoals } from "../services/goalsApi.js";
import { getCheckins } from "../services/checkinsApi.js";
import { getTelegramStatus } from "../services/telegramAPI.js";
import { extractErrorMessage } from "../services/api";

function todayISODate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function relativeTime(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [telegram, setTelegram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [goalData, checkinData, telegramData] = await Promise.all([
        getGoals(), getCheckins(), getTelegramStatus(),
      ]);
      setGoals(Array.isArray(goalData) ? goalData : []);
      setCheckins(Array.isArray(checkinData) ? checkinData : []);
      setTelegram(telegramData);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadId = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(loadId);
  }, [loadDashboard]);

  const activeGoals = goals.filter((goal) => (goal.status || "").toLowerCase() === "active");
  const todaysCheckins = checkins.filter((checkin) => checkin.date === todayISODate());
  const completedToday = todaysCheckins.filter((checkin) => (checkin.status || "").toLowerCase() === "completed").length;
  const progress = todaysCheckins.length ? Math.round((completedToday / todaysCheckins.length) * 100) : 0;

  const activity = useMemo(() => {
    const titles = new Map(goals.map((goal) => [goal.id, goal.title]));
    return [
      ...goals.map((goal) => ({ text: `Goal “${goal.title}” is ${String(goal.status || "active").toLowerCase()}`, date: goal.updated_at || goal.created_at })),
      ...checkins.map((checkin) => ({ text: `${titles.get(checkin.goal) || `Goal #${checkin.goal}`} check-in: ${String(checkin.status || "pending").toLowerCase()}`, date: checkin.updated_at || checkin.created_at })),
    ].filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
      .map((item) => ({ ...item, time: relativeTime(item.date) }));
  }, [goals, checkins]);

  const stats = [
    { label: "Active Goals", value: loading ? "…" : activeGoals.length, hint: "Being tracked", icon: TargetIcon },
    { label: "Today's Check-ins", value: loading ? "…" : todaysCheckins.length, hint: `${completedToday} completed`, icon: CheckIcon },
    { label: "Telegram Status", value: loading ? "Checking…" : telegram?.linked ? "Linked" : "Not Linked", hint: telegram?.username ? `@${telegram.username}` : "Connect to get reminders", icon: TelegramIcon, isStatus: true },
  ];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* WELCOME */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-indigo-500 mb-1">{greeting} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/goals")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold
                       px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-200
                       hover:from-indigo-700 hover:to-violet-700 hover:scale-[1.03] active:scale-95
                       transition-all duration-200 ease-in-out"
          >
            <PlusIcon className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {stats.map(({ label, value, hint, icon: Icon, isStatus }) => (
            <div
              key={label}
              className="group relative bg-white/90 border border-white rounded-2xl p-5
                         overflow-hidden shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100
                         hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
            >
              {/* soft gradient glow */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full
                           bg-indigo-200/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p
                    className={`mt-2 font-bold tracking-tight ${
                      isStatus ? "text-lg text-slate-700" : "text-3xl text-slate-900"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{hint}</p>
                </div>

                <div
                  className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center
                             text-indigo-600 flex-shrink-0"
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {isStatus && !loading && (
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${telegram?.linked ? "text-[#22C55E] bg-[#22C55E]/10" : "text-[#EF4444] bg-[#EF4444]/10"}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${telegram?.linked ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
                  {telegram?.linked ? "Connected" : "Not linked"}
                </span>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
            <span>{error}</span>
            <button type="button" onClick={loadDashboard} className="font-semibold text-red-700 hover:text-red-900">Retry</button>
          </div>
        )}

        {/* MAIN GRID: activity + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 bg-white/90 border border-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h2>
              <span className="text-xs text-slate-400">Most recent</span>
            </div>

            {activity.length === 0 ? (
              <EmptyState
                icon={ClockIcon}
                title="No activity yet"
                subtitle="Once you complete check-ins or update goals, they'll show up here."
              />
            ) : (
              <ul className="space-y-4">
                {activity.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700">{item.text}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="flex flex-col gap-5">
            {/* Today's progress */}
            <div className="bg-white/90 border border-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-4">
                Today's Progress
              </h2>
              <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full
                             transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress}% of today's check-ins complete
              </p>
            </div>

            {/* Telegram quick card */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-100 border border-blue-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
                  <TelegramIcon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-800">Telegram</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Link your account to get reminders and check in on the go.
              </p>
              <button
                type="button"
                onClick={() => navigate("/telegram")}
                className="w-full text-sm font-medium bg-white text-blue-700 border border-blue-200 rounded-xl py-2 shadow-sm
                           hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-95
                           transition-all duration-200 ease-in-out"
              >
                {telegram?.linked ? "View Telegram" : "Connect Telegram"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- empty state ---------- */

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtitle}</p>
    </div>
  );
}

/* ---------- icons ---------- */

function TargetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 3v3M16 3v3M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 14.5 11 17l4.5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TelegramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m3 12 17-8-5.5 17-4.7-6.3L3 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9.8 14.7 8.6-9.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
