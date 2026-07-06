import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(username, password);

    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <form onSubmit={handleLogin} className="w-96 p-6 bg-gray-900 rounded-xl">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 p-2 rounded">Login</button>
      </form>
    </div>
  );
}
