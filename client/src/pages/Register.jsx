import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/Auth/Input";

export default function Register() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Start your journey" subtitle="Our AI will guide you from here">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 fade-in">{error}</div>}
      <div className="space-y-4">
        <Input label="Full Name" value={form.name}     onChange={set("name")}     placeholder="Your name" />
        <Input label="Email"     type="email"    value={form.email}    onChange={set("email")}    placeholder="you@example.com" />
        <Input label="Password"  type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 characters" />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-accent text-midnight font-display font-bold py-3.5 rounded-xl mt-2
            hover:bg-accent-dim transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-midnight border-t-transparent rounded-full animate-spin" />Creating account...</span> : "Create account →"}
        </button>
      </div>
      <p className="text-center text-soft text-sm font-body mt-6">
        Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
