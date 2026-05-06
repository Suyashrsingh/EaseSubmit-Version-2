import React, { useState, useRef, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";


import { gsap } from "gsap";
import { useAuthStore } from "../../app/stores";


const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const roleRoute = useAuthStore((state) => state.roleRoute);
  // Refs for animation targets
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const centerLinksRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    // Ensure elements exist
    const logo = logoRef.current;
    const center = centerLinksRef.current;
    const actions = actionsRef.current;

    // select all center link items
    const centerItems = center ? Array.from(center.querySelectorAll("li")) : [];
    // select all action items (buttons/links)
    const actionItems = actions ? Array.from(actions.querySelectorAll(".action-item")) : [];

    // Create timeline
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1) Logo drops from top
    tl.fromTo(
      logo,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
    );

    // 2) Center nav links stagger in (only on desktop - if present)
    if (centerItems.length) {
      tl.fromTo(
        centerItems,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
        "-=0.2" // slight overlap with logo finishing
      );
    }

    // 3) Action buttons (login/signup or dashboard)
    if (actionItems.length) {
      tl.fromTo(
        actionItems,
        { y: -6, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.06 },
        "-=0.15"
      );
    }

    // cleanup on unmount
    return () => {
      tl.kill();
    };
  }, []); // run once on mount

  return (
    <>
      <div className="absolute top-0 left-0 w-screen h-[12vh] z-50">
        <div className="w-screen h-full px-4 py-3 sm:px-6 lg:px-8">
          <nav
            ref={navRef}
            className="h-full flex items-center justify-between gap-4 bg-white/90 border border-slate-100 rounded-2xl px-4 py-2 shadow-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Left: logo */}
            <div className="flex items-center h-full">
              <a
                href="#"
                className="inline-flex items-center"
                aria-label="SubmitEase home"
                ref={logoRef} // logo target
              >
                <img
                  src="/assets/logo.png"
                  alt="SubmitEase"
                  className="h-[4.5vh] sm:h-[4.6vh] md:h-[3.9vh] lg:h-[4vh] object-contain"
                />
              </a>
            </div>

            {/* Center: links - hidden on small screens */}
            <div className="hidden md:flex flex-1 justify-center">
              <ul
                ref={centerLinksRef} // center links target
                className="flex items-center gap-8 text-sm text-slate-700 opacity-100"
              >
                <li className="opacity-0">
                  {/* start hidden (opacity changed by GSAP) */}
                  <a href="#" className="hover:text-slate-900 transition">
                    Home
                  </a>
                </li>
                <li className="opacity-0">
                  <a href="#HowItWorks" className="hover:text-slate-900 transition">
                    Features
                  </a>
                </li>
                <li className="opacity-0">
                  <a href="#team" className="hover:text-slate-900 transition">
                    Team
                  </a>
                </li>
              </ul>
            </div>

            {/* Right: actions */}
            {!user ? (
              <div ref={actionsRef} className="flex items-center gap-3">
                {/* desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition action-item opacity-0"
                  >
                    Login
                  </NavLink>
                </div>

                {/* mobile menu toggle */}
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 action-item opacity-0"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((s) => !s)}
                >
                  {mobileOpen ? (
                    <HiOutlineX className="w-6 h-6" />
                  ) : (
                    <HiOutlineMenu className="w-6 h-6" />
                  )}
                </button>
              </div>
            ) : (
              <div ref={actionsRef} className="flex items-center gap-3 pr-[2vw]">
                <NavLink
                  to={roleRoute[user.role] || "/"}
                  className="text-blue-400 cursor-pointer action-item opacity-0"
                >
                  {user.role}
                </NavLink>
              </div>
            )}
          </nav>

          {/* Mobile panel */}
          {mobileOpen && (
            <div className="mt-3 md:hidden">
              <div className="bg-white/95 border border-slate-100 rounded-2xl shadow-sm p-4">
                <ul className="flex flex-col gap-2 text-sm text-slate-700 mb-4">
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      About
                    </a>
                  </li>
                </ul>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </a>
                  <a
                    href="#"
                    className="flex-1 text-center px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm shadow-sm hover:opacity-95"
                  >
                    Signup
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;