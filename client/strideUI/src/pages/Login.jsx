import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields to continue.");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          "Couldn't sign you in. Check your details and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0F172A] text-white">
      {/* Left brand / illustration panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-[#111827]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(250,204,21,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.14), transparent 45%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#FACC15] flex items-center justify-center shadow-lg shadow-[#FACC15]/20">
            <span className="text-[#0F172A] font-bold text-lg">S</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">StrideAI</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            Stay accountable.
            <br />
            <span className="text-[#FACC15]">Every single day.</span>
          </h1>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            Track your goals, log your check-ins, and let your AI coach keep you
            honest — right from chat or Telegram.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              "Daily check-ins that actually stick",
              "An AI that remembers your goals",
              "Progress you can see, not just feel",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} StrideAI. Built for people who follow
          through.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center">
              <span className="text-[#0F172A] font-bold">S</span>
            </div>
            <span className="font-semibold tracking-tight">StrideAI</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-gray-400">
            Sign in to keep your streak alive.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            <FloatingInput
              id="username"
              label="Email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <FloatingInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {error && (
              <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5] animate-fade-in">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="w-4 h-4 rounded-md border border-[#27272A] bg-[#18181B] flex items-center justify-center peer-checked:bg-[#FACC15] peer-checked:border-[#FACC15] transition-colors duration-200">
                  {remember && (
                    <svg
                      viewBox="0 0 12 12"
                      className="w-2.5 h-2.5 text-[#0F172A]"
                      fill="none"
                    >
                      <path
                        d="M2 6l2.5 2.5L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="group-hover:text-gray-300 transition-colors duration-200">
                  Remember me
                </span>
              </label>

              <a
                href="/forgot-password"
                className="text-gray-400 hover:text-[#FACC15] transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#FACC15] text-[#0F172A] font-semibold text-sm
                         transition-all duration-300 ease-in-out
                         hover:bg-[#EAB308] hover:shadow-lg hover:shadow-[#FACC15]/25 hover:scale-[1.02]
                         active:scale-95
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#FACC15] hover:text-[#EAB308] font-medium transition-colors duration-200"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  trailing,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full rounded-xl bg-[#18181B] border border-[#27272A] px-4 pt-5 pb-2 pr-11 text-sm text-white
                   placeholder-transparent outline-none
                   transition-all duration-300 ease-in-out
                   focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm
                   transition-all duration-200 ease-in-out pointer-events-none
                   peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-[#FACC15]
                   peer-[&:not(:placeholder-shown)]:top-3.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-400"
      >
        {label}
      </label>
      {trailing && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {trailing}
        </div>
      )}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4.5 h-4.5"
      fill="none"
      width="18"
      height="18"
    >
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4.5 h-4.5"
      fill="none"
      width="18"
      height="18"
    >
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 7 11 7a17.5 17.5 0 0 1-3.36 4.36M6.6 6.6C3.8 8.3 1 12 1 12a17.6 17.6 0 0 0 5.06 5.94A10.9 10.9 0 0 0 12 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
      />
    </svg>
  );
}
