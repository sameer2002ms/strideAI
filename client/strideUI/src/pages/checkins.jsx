import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getCheckins,
  completeCheckin,
  missCheckin,
  skipCheckin,
} from "../services/checkinsApi.js";

const STATUS_META = {
  pending: {
    label: "Pending",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    dot: "bg-gray-400",
  },
  complete: {
    label: "Completed",
    text: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    dot: "bg-[#22C55E]",
  },
  miss: {
    label: "Missed",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    dot: "bg-[#EF4444]",
  },
  skip: {
    label: "Skipped",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    dot: "bg-gray-400",
  },
};

// 📌 Backend status values may come back in a different case (e.g. "PENDING").
// Normalize before lookup so the existing pill styling still matches.
function statusMeta(status) {
  const key = (status || "").toLowerCase();
  return STATUS_META[key] || STATUS_META.pending;
}

// 📌 Maps each action button to its dedicated backend endpoint
const STATUS_ACTIONS = {
  complete: completeCheckin,
  miss: missCheckin,
  skip: skipCheckin,
};

// 📌 Local (not UTC) YYYY-MM-DD, to match the backend's "date" field correctly
function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 📌 Surfaces DRF validation errors without touching any error UI components
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

const TODAY_LABEL = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function Checkins() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // 📌 Load today's checkins
  // The backend only exposes a plain list endpoint, so we fetch everything
  // and filter down to today's date on the client.
  const loadCheckins = async () => {
    try {
      const data = await getCheckins();
      const todaysOnly = (data || []).filter((c) => c.date === todayISODate());
      setCheckins(todaysOnly);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadCheckins();
      setLoading(false);
    })();
  }, []);

  // 📌 Update status via the dedicated complete/miss/skip endpoints
  const handleUpdate = async (id, status) => {
    const action = STATUS_ACTIONS[status];
    if (!action) return;

    setUpdatingId(id);
    setError(null);
    try {
      await action(id);
      await loadCheckins();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = useMemo(
    () =>
      checkins.filter((c) => (c.status || "").toLowerCase() === "complete")
        .length,
    [checkins],
  );
  const progressPct = checkins.length
    ? Math.round((completedCount / checkins.length) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Today's Check-ins
          </h1>
          <p className="text-sm text-gray-500 mt-1">{TODAY_LABEL}</p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        {/* DAILY PROGRESS */}
        {!loading && checkins.length > 0 && (
          <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {completedCount} of {checkins.length} complete
              </span>
              <span className="text-sm text-[#FACC15] font-semibold">
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FACC15] to-[#F59E0B] rounded-full
                           transition-all duration-500 ease-in-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* LIST */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : checkins.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative pl-6">
            {/* timeline rail */}
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#27272A]" />

            <ul className="space-y-4">
              {checkins.map((c) => {
                const meta = statusMeta(c.status);
                const isUpdating = updatingId === c.id;
                // Backend object only guarantees `goal` (id) + `notes`, not a title.
                // Fall back gracefully so the card never renders blank.
                const title = c.goal_title || c.notes || `Goal #${c.goal}`;

                return (
                  <li key={c.id} className="relative">
                    {/* timeline dot */}
                    <span
                      className={`absolute -left-6 top-5 w-[10px] h-[10px] rounded-full ring-4 ring-[#0F172A] ${meta.dot}`}
                    />

                    <div
                      className={`bg-[#111827] border border-[#27272A] rounded-2xl p-4
                                  hover:border-[#FACC15]/30 transition-all duration-300 ease-in-out
                                  ${isUpdating ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* LEFT */}
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">
                            {title}
                          </p>
                          <span
                            className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium
                                        px-2.5 py-1 rounded-full ${meta.bg} ${meta.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}
                            />
                            {meta.label}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleUpdate(c.id, "complete")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-xl text-sm font-medium
                                       bg-[#22C55E]/10 text-[#22C55E]
                                       hover:bg-[#22C55E]/20 hover:scale-105 active:scale-95
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-all duration-200 ease-in-out"
                          >
                            Complete
                          </button>

                          <button
                            onClick={() => handleUpdate(c.id, "miss")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-xl text-sm font-medium
                                       bg-[#EF4444]/10 text-[#EF4444]
                                       hover:bg-[#EF4444]/20 hover:scale-105 active:scale-95
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-all duration-200 ease-in-out"
                          >
                            Miss
                          </button>

                          <button
                            onClick={() => handleUpdate(c.id, "skip")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-xl text-sm font-medium
                                       bg-[#27272A] text-gray-300
                                       hover:bg-[#3f3f46] hover:scale-105 active:scale-95
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-all duration-200 ease-in-out"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ---------- empty state ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#111827] border border-[#27272A] rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] mb-4">
        <CalendarIcon className="w-6 h-6" />
      </div>
      <p className="text-base font-medium text-white">No check-ins for today</p>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        Check-ins from your active goals will show up here each day.
      </p>
    </div>
  );
}

/* ---------- skeleton ---------- */

function SkeletonRow() {
  return (
    <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#27272A] rounded" />
          <div className="h-4 w-20 bg-[#27272A] rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-[#27272A] rounded-xl" />
          <div className="h-8 w-16 bg-[#27272A] rounded-xl" />
          <div className="h-8 w-16 bg-[#27272A] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ---------- icons ---------- */

function CalendarIcon(props) {
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
    </svg>
  );
}
