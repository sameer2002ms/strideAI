import { useState, useMemo } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !firstName || !lastName || !email || !password) {
      setError("Please fill in every field to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match yet — give it another look.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      navigate("/login");
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          "Couldn't create your account. Please try again.",
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
              "radial-gradient(circle at 25% 30%, rgba(250,204,21,0.18), transparent 45%), radial-gradient(circle at 75% 75%, rgba(245,158,11,0.14), transparent 45%)",
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
            Your goals deserve
            <br />
            <span className="text-[#FACC15]">a witness.</span>
          </h1>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            Create your account and get an AI accountability partner that checks
            in, tracks progress, and never lets a goal quietly disappear.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3">
            <MiniStep n="1" label="Create your account" active />
            <MiniStep n="2" label="Set your first goal" />
            <MiniStep n="3" label="Get your first check-in" />
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
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-gray-400">
            Takes less than a minute. No card required.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5" noValidate>
            <FloatingInput
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <FloatingInput
              id="firstName"
              label="First name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />

            <FloatingInput
              id="lastName"
              label="Last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />

            <FloatingInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div>
              <FloatingInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-[#27272A] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-in-out ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <FloatingInput
              id="confirmPassword"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
                {error}
              </div>
            )}

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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#FACC15] hover:text-[#EAB308] font-medium transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStep({ n, label, active }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors duration-300
        ${active ? "bg-[#FACC15] text-[#0F172A]" : "bg-[#18181B] border border-[#27272A] text-gray-500"}`}
      >
        {n}
      </div>
      <span className={`text-sm ${active ? "text-gray-200" : "text-gray-500"}`}>
        {label}
      </span>
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

function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: "Weak", color: "bg-[#EF4444]", percent: 25 },
    { label: "Weak", color: "bg-[#EF4444]", percent: 25 },
    { label: "Fair", color: "bg-[#F59E0B]", percent: 55 },
    { label: "Good", color: "bg-[#EAB308]", percent: 80 },
    { label: "Strong", color: "bg-[#22C55E]", percent: 100 },
  ];

  return levels[score];
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
