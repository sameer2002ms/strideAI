import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getGoals, createGoal, deleteGoal } from "../services/goalsApi.js";
import { extractErrorMessage } from "../services/api";

const STATUS_STYLES = {
  active: {
    label: "Active",
    text: "text-[#FACC15]",
    bg: "bg-[#FACC15]/10",
    dot: "bg-[#FACC15]",
  },
  completed: {
    label: "Completed",
    text: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    dot: "bg-[#22C55E]",
  },
  paused: {
    label: "Paused",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    dot: "bg-gray-400",
  },
  archived: {
    label: "Archived",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
    dot: "bg-gray-400",
  },
};

function statusStyle(status) {
  return STATUS_STYLES[(status || "").toLowerCase()] || STATUS_STYLES.active;
}

const FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"];
const WEEKDAYS = [
  { value: 0, label: "Mon" },
  { value: 1, label: "Tue" },
  { value: 2, label: "Wed" },
  { value: 3, label: "Thu" },
  { value: 4, label: "Fri" },
  { value: 5, label: "Sat" },
  { value: 6, label: "Sun" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("DAILY");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [startDate, setStartDate] = useState(todayISO());

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");

  // 📌 Load goals
  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
      setListError("");
    } catch (err) {
      setListError(extractErrorMessage(err, "Couldn't load your goals."));
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadGoals();
      setLoading(false);
    })();
  }, []);

  const toggleDay = (value) => {
    setDaysOfWeek((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFrequency("DAILY");
    setDaysOfWeek([]);
    setStartDate(todayISO());
    setFormError("");
  };

  // 📌 Create goal
  const handleCreate = async () => {
    setFormError("");

    if (!title.trim()) {
      setFormError("Give your goal a title.");
      return;
    }
    if (!frequency) {
      setFormError("Choose how often this goal repeats.");
      return;
    }
    if (!startDate) {
      setFormError("Pick a start date.");
      return;
    }
    if (frequency === "WEEKLY" && daysOfWeek.length === 0) {
      setFormError("Pick at least one day of the week.");
      return;
    }

    setCreating(true);
    try {
      await createGoal({
        title,
        description,
        metadata: {},
        schedule: {
          // Backend only accepts lowercase choices ("daily"/"weekly"/"monthly"/"custom").
          // UI state stays uppercase for the select/comparisons above — only the
          // outgoing payload is normalized here.
          frequency: frequency.toLowerCase(),
          days_of_week: frequency === "WEEKLY" ? daysOfWeek : [],
          day_of_month: null,
          interval: 1,
          start_date: startDate,
          end_date: null,
          custom_rule: "",
        },
      });
      await loadGoals();
      setModalOpen(false);
      resetForm();
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't create that goal."));
    } finally {
      setCreating(false);
    }
  };

  // 📌 Delete goal
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteGoal(id);
      await loadGoals();
    } catch (err) {
      setListError(extractErrorMessage(err, "Couldn't delete that goal."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Goals
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {loading
                ? "Loading your goals…"
                : `${goals.length} goal${goals.length === 1 ? "" : "s"} total`}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0F172A] font-semibold
                       px-4 py-2.5 rounded-xl shadow-lg shadow-[#FACC15]/20
                       hover:bg-[#EAB308] hover:scale-[1.03] active:scale-95
                       transition-all duration-200 ease-in-out"
          >
            <PlusIcon className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {listError && (
          <div className="mb-6 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
            {listError}
          </div>
        )}

        {/* GOALS LIST */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const style = statusStyle(goal.status);
              const isDeleting = deletingId === goal.id;

              return (
                <div
                  key={goal.id}
                  className={`group bg-[#111827] border border-[#27272A] rounded-2xl p-5
                              hover:border-[#FACC15]/30 hover:shadow-xl hover:shadow-black/20
                              transition-all duration-300 ease-in-out
                              ${isDeleting ? "opacity-40 scale-[0.98]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {goal.title}
                      </p>
                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium
                                    px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                        />
                        {style.label}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      disabled={isDeleting}
                      aria-label="Delete goal"
                      className="text-gray-500 hover:text-[#EF4444] p-1.5 rounded-lg
                                 hover:bg-[#EF4444]/10 transition-all duration-200 ease-in-out
                                 opacity-0 group-hover:opacity-100 flex-shrink-0 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {typeof goal.progress === "number" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FACC15] to-[#F59E0B] rounded-full
                                     transition-all duration-500 ease-in-out"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE GOAL MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50
                     transition-opacity duration-200 ease-in-out"
          onClick={() => !creating && setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111827] border border-[#27272A] rounded-2xl p-6
                       shadow-2xl shadow-black/40 animate-[fadeIn_0.2s_ease-in-out]"
          >
            <h2 className="text-lg font-semibold text-white mb-1">
              Create a new goal
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              What do you want to stay accountable for?
            </p>

            <div className="space-y-4">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages a day"
                className="w-full p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                           placeholder-gray-500 outline-none focus:border-[#FACC15]/50
                           transition-colors duration-200"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                           placeholder-gray-500 outline-none resize-none focus:border-[#FACC15]/50
                           transition-colors duration-200"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Repeats
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                               outline-none focus:border-[#FACC15]/50 transition-colors duration-200"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f}>
                        {f.charAt(0) + f.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                               outline-none focus:border-[#FACC15]/50 transition-colors duration-200"
                  />
                </div>
              </div>

              {frequency === "WEEKLY" && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    On these days
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-in-out
                                    ${
                                      daysOfWeek.includes(day.value)
                                        ? "bg-[#FACC15] text-[#0F172A]"
                                        : "bg-[#18181B] border border-[#27272A] text-gray-400 hover:text-white"
                                    }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formError && (
                <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
                  {formError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                disabled={creating}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400
                           hover:bg-[#18181B] hover:text-white transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!title || creating}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#FACC15] text-[#0F172A]
                           hover:bg-[#EAB308] hover:scale-[1.03] active:scale-95
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                           transition-all duration-200 ease-in-out"
              >
                {creating ? "Adding…" : "Add Goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* ---------- empty state ---------- */

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#111827] border border-[#27272A] rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] mb-4">
        <TargetIcon className="w-6 h-6" />
      </div>
      <p className="text-base font-medium text-white">No goals yet</p>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        Create your first goal to start tracking progress and building streaks.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 bg-[#FACC15] text-[#0F172A] font-semibold
                   px-4 py-2.5 rounded-xl shadow-lg shadow-[#FACC15]/20
                   hover:bg-[#EAB308] hover:scale-[1.03] active:scale-95
                   transition-all duration-200 ease-in-out"
      >
        <PlusIcon className="w-4 h-4" />
        Create a goal
      </button>
    </div>
  );
}

/* ---------- skeleton ---------- */

function SkeletonCard() {
  return (
    <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-1/2 bg-[#27272A] rounded mb-3" />
      <div className="h-5 w-20 bg-[#27272A] rounded-full mb-4" />
      <div className="h-2 w-full bg-[#27272A] rounded-full" />
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
function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
