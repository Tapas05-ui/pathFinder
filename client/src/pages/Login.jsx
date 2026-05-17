import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/Auth/Input";

export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.onboardingComplete ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Continue your career journey">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 fade-in">{error}</div>}
      <div className="space-y-4">
        <Input label="Email"    type="email"    value={form.email}    onChange={set("email")}    placeholder="you@example.com" />
        <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-accent text-midnight font-display font-bold py-3.5 rounded-xl mt-2
            hover:bg-accent-dim transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-midnight border-t-transparent rounded-full animate-spin" />Signing in...</span> : "Sign in →"}
        </button>
      </div>
      <p className="text-center text-soft text-sm font-body mt-6">
        Don't have an account? <Link to="/register" className="text-accent hover:underline font-medium">Create one</Link>
      </p>
    </AuthLayout>
  );
}
