import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="h-screen flex bg-gray-950 text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">🚀 StrideAI</h1>

        <nav className="flex flex-col gap-2 mt-6">
          <Link className="hover:bg-gray-800 p-2 rounded" to="/dashboard">
            Dashboard
          </Link>

          <Link className="hover:bg-gray-800 p-2 rounded" to="/goals">
            Goals
          </Link>

          <Link className="hover:bg-gray-800 p-2 rounded" to="/checkins">
            Check-ins
          </Link>

          <Link className="hover:bg-gray-800 p-2 rounded" to="/chat">
            Conversations
          </Link>

          <Link className="hover:bg-gray-800 p-2 rounded" to="/telegram">
            Telegram
          </Link>
        </nav>

        <button onClick={logout} className="mt-auto bg-red-600 p-2 rounded">
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4">
          <p className="text-sm text-gray-400">StrideAI Control Center</p>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
