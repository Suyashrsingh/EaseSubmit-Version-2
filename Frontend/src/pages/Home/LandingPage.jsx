import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FiUpload, FiFileText, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="h-screen w-screen pt-[12vh] px-[1vw] pb-[2vw] bg-[#f6f8fb]">
      <div className="w-screen px-[2vw] h-full flex flex-col md:flex-row items-stretch gap-8">
        {/* Left column */}
        <div className="w-screen md:w-2/3 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Simplify College
            <br />
            Submissions Like Never
            <br />
            Before.
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mb-8">
            A unified platform where students can submit assignments easily and faculty can track
            progress effortlessly — fast uploads, real-time tracking, and grade-ready tools.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-[#1e4fd7] transition"
            >
              Login
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
              Smart Submissions
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
              Better Management
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
              Effortless Tracking
            </span>
          </div>
        </div>
        <div className="w-1/2 h-full">
          <img src="./assets/landinglogo.png" className="object-center object-contain size-full"/>
        </div>
        
      </div>
    </div>
  );
};

export default HeroSection;