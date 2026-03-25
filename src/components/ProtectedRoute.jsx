import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log(token, role);

  if (!token || !role) {
    console.log("no token or role found so directing to login");
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role === roleRequired) {
    return children;
  } else {
    console.log(
      "this takes to login page because role not equals to required one!"
    );

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
