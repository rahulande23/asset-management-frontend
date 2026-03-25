import "./App.css";
import Login from "./components/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectOnLoad from "./components/RedirectOnLoad";
import TeamLeaderDashboard from "./components/manager/TeamLeaderDashboard";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  // localStorage.clear();         
  // localStorage.setItem("token", "ahalhfahaa");
  // localStorage.setItem("role", "teamleader");

  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<RedirectOnLoad />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teamleader"
          element={
            <ProtectedRoute roleRequired="teamleader">
              <TeamLeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute roleRequired="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
