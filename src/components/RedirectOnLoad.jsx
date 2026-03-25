import React from "react";
import { Navigate } from "react-router-dom";

const RedirectOnLoad = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  

  if (role === "admin") return <Navigate to="/admin" replace />;
  else if (role === "teamleader") return <Navigate to="/teamleader" replace />;
  else if (role === "employee") return <Navigate to="/employee" replace />;
  return <Navigate to="/login" replace />;
};

export default RedirectOnLoad;
