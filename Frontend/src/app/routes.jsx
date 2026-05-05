import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import HeroSection from "../pages/Home/LandingPage";
import Login from "../pages/Auth/Login";

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
const PrivateRoutes = [];

export const router = createBrowserRouter([...PublicRoutes, ...PrivateRoutes]);
