import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import HeroSection from "../pages/Home/LandingPage";
import Login from "../pages/Auth/Login";
import { useAuthStore } from "./stores";

const user = useAuthStore.getState().user;

const PublicRoutes = [
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
];

const StudentRoutes = [
  {
    path: "/student",
    element: <div>Student Dashboard</div>,
  },
];

const HODRoutes = [
  {
    path: "/hod",
    element: <div>HOD Dashboard</div>,
  },
];

const ClassCoordinatorRoutes = [
  {
    path: "/classcoordinator",
    element: <div>Class Coordinator Dashboard</div>,
  },
];

const FacultyTeacherRoutes = [
  {
    path: "/teacher",
    element: <div>Faculty Teacher Dashboard</div>,
  },
];

export const router = createBrowserRouter([
  ...PublicRoutes,
  ...(user?.role === "Student" ? StudentRoutes : []),
  ...(user?.role === "HOD" ? HODRoutes : []),
  ...(user?.role === "ClassCoordinator" ? ClassCoordinatorRoutes : []),
  ...(user?.role === "Teacher" ? FacultyTeacherRoutes : []),
]);
