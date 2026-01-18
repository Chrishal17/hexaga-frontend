import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ChatProvider } from "./context/ChatContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Remedies from "./pages/Remedies";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to home if unauthorized for this specific role
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          {" "}
          {/* Wrapped ToastProvider with ChatProvider */}
          <ToastProvider>
            {" "}
            {/* Wrapped Routes with ToastProvider */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:sessionId" element={<Chat />} />
                <Route path="/remedies" element={<Remedies />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "hospital"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
