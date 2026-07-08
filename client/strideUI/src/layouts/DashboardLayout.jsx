// // import { useAuth } from "../context/authContext";
// // import { Link } from "react-router-dom";

// // export default function DashboardLayout({ children }) {
// //   const { logout } = useAuth();

// //   return (
// //     <div className="h-screen flex bg-gray-950 text-white">
// //       {/* SIDEBAR */}
// //       <div className="w-64 bg-gray-900 p-4 flex flex-col gap-4">
// //         <h1 className="text-xl font-bold">🚀 StrideAI</h1>

// //         <nav className="flex flex-col gap-2 mt-6">
// //           <Link className="hover:bg-gray-800 p-2 rounded" to="/dashboard">
// //             Dashboard
// //           </Link>

// //           <Link className="hover:bg-gray-800 p-2 rounded" to="/goals">
// //             Goals
// //           </Link>

// //           <Link className="hover:bg-gray-800 p-2 rounded" to="/checkins">
// //             Check-ins
// //           </Link>

// //           <Link className="hover:bg-gray-800 p-2 rounded" to="/chat">
// //             Conversations
// //           </Link>

// //           <Link className="hover:bg-gray-800 p-2 rounded" to="/telegram">
// //             Telegram
// //           </Link>
// //         </nav>

// //         <button onClick={logout} className="mt-auto bg-red-600 p-2 rounded">
// //           Logout
// //         </button>
// //       </div>

// //       {/* MAIN AREA */}
// //       <div className="flex-1 flex flex-col">
// //         {/* TOPBAR */}
// //         <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4">
// //           <p className="text-sm text-gray-400">StrideAI Control Center</p>
// //         </div>

// //         {/* PAGE CONTENT */}
// //         <div className="p-6 overflow-auto flex-1">{children}</div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { useAuth } from "../context/authContext";
// import { Link, useLocation } from "react-router-dom";

// const NAV_ITEMS = [
//   { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
//   { to: "/goals", label: "Goals", icon: TargetIcon },
//   { to: "/checkins", label: "Check-ins", icon: CheckIcon },
//   { to: "/chat", label: "Conversations", icon: ChatIcon },
//   { to: "/telegram", label: "Telegram", icon: TelegramIcon },
// ];

// const PAGE_TITLES = {
//   "/dashboard": "Overview",
//   "/goals": "Goals",
//   "/checkins": "Check-ins",
//   "/chat": "Conversations",
//   "/telegram": "Telegram",
// };

// export default function DashboardLayout({ children }) {
//   const { logout, user } = useAuth();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const pageTitle = PAGE_TITLES[location.pathname] || "StrideAI";

//   return (
//     <div className="h-screen flex bg-[#0F172A] text-white overflow-hidden">
//       {/* SIDEBAR */}
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-[#111827] border-r border-[#27272A]
//                     flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
//       >
//         {/* Logo + collapse toggle */}
//         <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272A]">
//           <div className="flex items-center gap-2 overflow-hidden">
//             <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#FACC15]/20">
//               <span className="text-[#0F172A] font-bold text-sm">S</span>
//             </div>
//             {!collapsed && (
//               <span className="font-semibold tracking-tight whitespace-nowrap">
//                 StrideAI
//               </span>
//             )}
//           </div>

//           <button
//             onClick={() => setCollapsed((c) => !c)}
//             className="text-gray-500 hover:text-[#FACC15] transition-colors duration-200 flex-shrink-0"
//             aria-label="Toggle sidebar"
//           >
//             <ChevronIcon flipped={collapsed} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
//           {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
//             const active = location.pathname === to;
//             return (
//               <Link
//                 key={to}
//                 to={to}
//                 title={collapsed ? label : undefined}
//                 className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
//                             transition-all duration-200 ease-in-out
//                             ${
//                               active
//                                 ? "bg-[#FACC15]/10 text-[#FACC15]"
//                                 : "text-gray-400 hover:bg-[#18181B] hover:text-white"
//                             }`}
//               >
//                 {active && (
//                   <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#FACC15]" />
//                 )}
//                 <Icon className="w-[18px] h-[18px] flex-shrink-0" />
//                 {!collapsed && <span className="truncate">{label}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User / logout */}
//         <div className="border-t border-[#27272A] p-3">
//           <div
//             className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
//               collapsed ? "justify-center" : ""
//             }`}
//           >
//             <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center text-xs font-semibold text-gray-300 flex-shrink-0">
//               {(user?.username || user?.email || "U").slice(0, 1).toUpperCase()}
//             </div>
//             {!collapsed && (
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium truncate">
//                   {user?.username || user?.email || "Account"}
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">Signed in</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={logout}
//             className={`mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
//                        text-gray-400 hover:bg-[#EF4444]/10 hover:text-[#EF4444]
//                        transition-all duration-200 ease-in-out
//                        ${collapsed ? "justify-center" : ""}`}
//           >
//             <LogoutIcon className="w-[18px] h-[18px] flex-shrink-0" />
//             {!collapsed && "Log out"}
//           </button>
//         </div>
//       </aside>

//       {/* MAIN AREA */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* TOPBAR */}
//         <header className="h-16 bg-[#111827]/80 backdrop-blur-sm border-b border-[#27272A] flex items-center justify-between px-6 flex-shrink-0">
//           <div>
//             <p className="text-xs text-gray-500">StrideAI / Control Center</p>
//             <h1 className="text-sm font-semibold text-white">{pageTitle}</h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <div
//               className="hidden sm:flex items-center gap-2 bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-1.5 w-56
//                             focus-within:border-[#FACC15]/50 transition-colors duration-200"
//             >
//               <SearchIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="bg-transparent text-sm outline-none placeholder-gray-500 w-full"
//               />
//             </div>

//             <button
//               className="relative text-gray-400 hover:text-[#FACC15] transition-colors duration-200"
//               aria-label="Notifications"
//             >
//               <BellIcon className="w-5 h-5" />
//               <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FACC15]" />
//             </button>

//             <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center text-xs font-semibold text-gray-300 cursor-pointer hover:ring-2 hover:ring-[#FACC15]/40 transition-all duration-200">
//               {(user?.username || user?.email || "U").slice(0, 1).toUpperCase()}
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="p-6 overflow-auto flex-1">{children}</main>
//       </div>
//     </div>
//   );
// }

// /* ---------- icons ---------- */

// function HomeIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="M3 10.5 12 3l9 7.5"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function TargetIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
//       <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
//       <circle cx="12" cy="12" r="1.2" fill="currentColor" />
//     </svg>
//   );
// }
// function CheckIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <rect
//         x="3.5"
//         y="4.5"
//         width="17"
//         height="16"
//         rx="3"
//         stroke="currentColor"
//         strokeWidth="1.7"
//       />
//       <path
//         d="M8 3v3M16 3v3M3.5 10h17"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//       />
//       <path
//         d="M8.5 14.5 11 17l4.5-5"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function ChatIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="M4 5h16v11H8l-4 4V5Z"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function TelegramIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="m3 12 17-8-5.5 17-4.7-6.3L3 12Z"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinejoin="round"
//       />
//       <path
//         d="m9.8 14.7 8.6-9.9"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
// function LogoutIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M15 16l5-4-5-4M20 12H9"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function ChevronIcon({ flipped }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       className={`w-4 h-4 transition-transform duration-300 ${flipped ? "rotate-180" : ""}`}
//     >
//       <path
//         d="M15 6l-6 6 6 6"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// function SearchIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
//       <path
//         d="m20 20-3.5-3.5"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
// function BellIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M10 21a2 2 0 0 0 4 0"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/goals", label: "Goals", icon: TargetIcon },
  { to: "/checkins", label: "Check-ins", icon: CheckIcon },
  { to: "/chat", label: "Conversations", icon: ChatIcon },
  { to: "/telegram", label: "Telegram", icon: TelegramIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/goals": "Goals",
  "/checkins": "Check-ins",
  "/chat": "Conversations",
  "/telegram": "Telegram",
  "/settings": "Settings",
};

export default function DashboardLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] || "StrideAI";
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="dashboard-light h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} bg-white/90 backdrop-blur-xl border-r border-indigo-100
                    flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
      >
        {/* Logo + collapse toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {!collapsed && (
              <span className="font-semibold tracking-tight whitespace-nowrap">
                StrideAI
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-slate-400 hover:text-indigo-600 transition-colors duration-200 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <ChevronIcon flipped={collapsed} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-200 ease-in-out
                            ${
                              active
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-indigo-600" />
                )}
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User / logout */}
        <div className="border-t border-indigo-100 p-3">
          <div
            className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
              {(user?.username || user?.email || "U").slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {user?.username || user?.email || "Account"}
                </p>
                <p className="text-xs text-slate-400 truncate">Signed in</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={`mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                       text-slate-500 hover:bg-red-50 hover:text-red-600
                       transition-all duration-200 ease-in-out
                       ${collapsed ? "justify-center" : ""}`}
          >
            <LogoutIcon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-white/75 backdrop-blur-xl border-b border-indigo-100 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <p className="text-xs text-slate-400">StrideAI / Control Center</p>
            <h1 className="text-sm font-semibold text-slate-800">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs font-medium text-slate-500">
              {dateLabel}
            </span>

            <Link
              to="/settings"
              className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all duration-200"
            >
              {(user?.username || user?.email || "U").slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}

/* ---------- icons ---------- */

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 10.5 12 3l9 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
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
function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
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
function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1.04-1.56V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.56 1.04H20a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.09Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 16l5-4-5-4M20 12H9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronIcon({ flipped }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`w-4 h-4 transition-transform duration-300 ${flipped ? "rotate-180" : ""}`}
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
