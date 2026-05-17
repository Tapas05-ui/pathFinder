import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home       from "./pages/Home";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard  from "./pages/Dashboard";
import CheckIn    from "./pages/CheckIn";

const Spinner = () => (
  <div className="min-h-screen bg-midnight flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return (
    <Routes>
      <Route path="/"           element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/login"      element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register"   element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/checkin"    element={<PrivateRoute><CheckIn /></PrivateRoute>} />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
