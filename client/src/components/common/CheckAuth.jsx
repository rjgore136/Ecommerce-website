import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const role = user?.role;

  console.log(location.pathname, isAuthenticated, role);

  // Redirect based on authentication status and role at the root path
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to={`/auth/login`} />;
    } else {
      return role === "admin" ? (
        <Navigate to={`/admin/dashboard`} />
      ) : (
        <Navigate to={`/shop/home`} />
      );
    }
  }

  // Redirect if unauthenticated user tries to access protected routes
  if (!isAuthenticated) {
    if (
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      return <Navigate to={`/auth/login`} />;
    }
  } else {
    // Redirect if authenticated user tries to access login/register pages
    if (
      location.pathname.includes("/login") ||
      location.pathname.includes("register")
    ) {
      return role === "admin" ? (
        <Navigate to={`/admin/dashboard`} />
      ) : (
        <Navigate to={`/shop/home`} />
      );
    }

    // Redirect if non-admin tries to access admin routes
    if (role !== "admin" && location.pathname.includes("admin")) {
      return <Navigate to="/unauth-page" />;
    }

    // Redirect if admin tries to access non-admin routes
    if (role === "admin" && location.pathname.includes("shop")) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return <div>{children}</div>;
};

export default CheckAuth;
