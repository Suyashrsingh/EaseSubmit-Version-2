import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts & Public Pages
import Navbar from "../components/ui/Navbar";
import HeroSection from "../pages/Home/LandingPage";
import Login from "../pages/Auth/Login";

// Protected Route Component
import ProtectedRoute from "./ProtectedRoute";

// Protected Pages
import StudentDashboard from "../pages/Student/StudentDashboard";
import FacultyDashboard from "../pages/Faculty/FacultyDashboard";
import ClassCoordinatorDashboard from "../pages/ClassCoordinator/ClassCoordinatorDashboard";
import HodDashboard from "../pages/Hod/HodDashboard";
import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <HeroSection />
      </>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },

  // Student Routes
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["Student"]}>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },

  // HOD Routes
  {
    path: "/hod",
    element: (
      <ProtectedRoute allowedRoles={["HOD"]}>
        <HodDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hod/teacher",
    element: (
      <ProtectedRoute allowedRoles={["HOD"]}>
        <FacultyDashboard />
      </ProtectedRoute>
    ),
  },

  // Teacher Routes
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <FacultyDashboard />
      </ProtectedRoute>
    ),
  },

  // Class Coordinator Routes
  {
    path: "/classcoordinator",
    element: (
      <ProtectedRoute allowedRoles={["ClassCoordinator"]}>
        <ClassCoordinatorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/classcoordinator/teacher",
    element: (
      <ProtectedRoute allowedRoles={["ClassCoordinator"]}>
        <FacultyDashboard />
      </ProtectedRoute>
    ),
  },

  // Change Password (all logged-in non-student roles)
  {
    path: "/confirm-password",
    element: (
      <ProtectedRoute allowedRoles={["Teacher", "ClassCoordinator", "HOD"]}>
        <ChangePasswordPage />
      </ProtectedRoute>
    ),
  },
]);
