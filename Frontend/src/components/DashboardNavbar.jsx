import React from "react";
import { HiOutlineBell } from "react-icons/hi";
import { useAuthStore } from "../app/stores";
import { Link, NavLink, useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const roleRoute = useAuthStore((state) => state.roleRoute);
  const navigate = useNavigate();

  const logout = () => {
    setAuth(null);
    navigate("/login");
  };

  const getRoleRoute = (role) => roleRoute[role] || "/";

  return (
    <header className="w-screen bg-white py-[1vw] px-[5vw]" id="dashboard_navbar">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 border rounded-lg border-gray-300">
        <div className="relative h-14 flex items-center">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center" aria-label="Home">
              <img
                src="/assets/logo.png"
                alt="SubmitEase"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Title */}
          <div className="absolute inset-x-0 left-0 right-0 pointer-events-none flex justify-center">
            <div className="text-sm sm:text-base font-medium text-slate-600 pointer-events-auto flex gap-[2vw]">
              {user?.role ? (
                (user.role === "ClassCoordinator" || user.role === "HOD") ? (
                  <>
                    <NavLink
                      to={`${getRoleRoute(user.role)}`}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                          : "text-slate-600 hover:text-blue-500"
                      }
                    >
                      {user.role}
                    </NavLink>

                    <NavLink
                      to={`${getRoleRoute(user.role)}/teacher`}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                          : "text-slate-600 hover:text-blue-500"
                      }
                    >
                      Subject Teacher
                    </NavLink>
                  </>
                ) : (
                  <span>{user.role} Dashboard</span>
                )
              ) : (
                <span>Dashboard</span>
              )}
            </div>
          </div>

          {/* Right: actions (bell / profile placeholder) */}
          <div className="ml-auto flex items-center gap-4">
            {user.role !== "Student" && <NavLink to="/confirm-password" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">Change Password</NavLink>}
            <button onClick={logout} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
