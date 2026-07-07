// import DashboardLayout from "../layouts/DashboardLayout";

// export default function Dashboard() {
//   return (
//     <DashboardLayout>
//       <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

//       {/* GRID CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className="bg-gray-900 p-4 rounded-xl">
//           <h2 className="text-gray-400">Active Goals</h2>
//           <p className="text-2xl font-bold">--</p>
//         </div>

//         <div className="bg-gray-900 p-4 rounded-xl">
//           <h2 className="text-gray-400">Today's Check-ins</h2>
//           <p className="text-2xl font-bold">--</p>
//         </div>

//         <div className="bg-gray-900 p-4 rounded-xl">
//           <h2 className="text-gray-400">Telegram Status</h2>
//           <p className="text-2xl font-bold">Not Linked</p>
//         </div>
//       </div>

//       {/* RECENT ACTIVITY */}
//       <div className="mt-6 bg-gray-900 p-4 rounded-xl">
//         <h2 className="text-gray-400 mb-2">Recent Activity</h2>
//         <p className="text-sm text-gray-500">No activity yet</p>
//       </div>
//     </DashboardLayout>
//   );
// }

import DashboardLayout from "../layouts/DashboardLayout";

const STATS = [
  {
    label: "Active Goals",
    value: "--",
    hint: "Being tracked",
    icon: TargetIcon,
  },
  {
    label: "Today's Check-ins",
    value: "--",
    hint: "Logged today",
    icon: CheckIcon,
  },
  {
    label: "Telegram Status",
    value: "Not Linked",
    hint: "Connect to get reminders",
    icon: TelegramIcon,
    isStatus: true,
  },
];

const ACTIVITY = []; // wire up to real data — empty state renders below

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* WELCOME */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">{greeting} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dashboard Overview
            </h1>
          </div>

          <button
            className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0F172A] font-semibold
                       px-4 py-2.5 rounded-xl shadow-lg shadow-[#FACC15]/20
                       hover:bg-[#EAB308] hover:scale-[1.03] active:scale-95
                       transition-all duration-200 ease-in-out"
          >
            <PlusIcon className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {STATS.map(({ label, value, hint, icon: Icon, isStatus }) => (
            <div
              key={label}
              className="group relative bg-[#111827] border border-[#27272A] rounded-2xl p-5
                         overflow-hidden hover:border-[#FACC15]/30 hover:shadow-xl hover:shadow-black/20
                         hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
            >
              {/* soft gradient glow */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full
                           bg-[#FACC15]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-sm text-gray-400">{label}</p>
                  <p
                    className={`mt-2 font-bold tracking-tight ${
                      isStatus ? "text-lg text-gray-300" : "text-3xl text-white"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{hint}</p>
                </div>

                <div
                  className="w-10 h-10 rounded-xl bg-[#FACC15]/10 flex items-center justify-center
                             text-[#FACC15] flex-shrink-0"
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {isStatus && (
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#EF4444]
                             bg-[#EF4444]/10 px-2.5 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  Not linked
                </span>
              )}
            </div>
          ))}
        </div>

        {/* MAIN GRID: activity + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 bg-[#111827] border border-[#27272A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">
                Recent Activity
              </h2>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>

            {ACTIVITY.length === 0 ? (
              <EmptyState
                icon={ClockIcon}
                title="No activity yet"
                subtitle="Once you complete check-ins or update goals, they'll show up here."
              />
            ) : (
              <ul className="space-y-4">
                {ACTIVITY.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#FACC15] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">{item.text}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="flex flex-col gap-5">
            {/* Today's progress */}
            <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">
                Today's Progress
              </h2>
              <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FACC15] to-[#F59E0B] rounded-full
                             transition-all duration-500 ease-in-out"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                0% of today's check-ins complete
              </p>
            </div>

            {/* Telegram quick card */}
            <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
                  <TelegramIcon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Telegram</h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Link your account to get reminders and check in on the go.
              </p>
              <button
                className="w-full text-sm font-medium bg-[#FACC15]/10 text-[#FACC15] rounded-xl py-2
                           hover:bg-[#FACC15]/20 hover:scale-[1.02] active:scale-95
                           transition-all duration-200 ease-in-out"
              >
                Connect Telegram
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
      <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-gray-500 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-300">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{subtitle}</p>
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