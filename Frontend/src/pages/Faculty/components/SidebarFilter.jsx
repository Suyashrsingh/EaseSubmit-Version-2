import React from "react";
import { MDM } from "../../../utils/constants";
import { useSubjects } from "../hooks/useFacultyQueries";

const SidebarFilter = ({ selectedsubject, setselectedsubject }) => {
  const { data: subjects = [], isLoading } = useSubjects();

  const selectedId = selectedsubject ? String(selectedsubject._id) : "";

  return (
    <aside className="hidden md:flex md:flex-col w-80 lg:w-96 bg-transparent h-full">
      <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-4 shrink-0">
          Select Subject Filter
        </h3>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <svg className="w-8 h-8 animate-spin text-blue-500" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {(() => {
              const safeSubjects = Array.isArray(subjects) ? subjects : [];
              const uniqueSubjects = [];
              const seen = new Set();
              
              for (const s of safeSubjects) {
                // For MDM subjects, group by subject, class, division, and batch
                // For others, use their unique _id
                const key = MDM.includes(s.subject)
                  ? `${s.subject}-${s.className || ''}-${s.division || ''}-${s.batch || ''}`
                  : `${s._id}-${s.subject}`;
                  
                if (!seen.has(key)) {
                  seen.add(key);
                  uniqueSubjects.push(s);
                }
              }

              if (uniqueSubjects.length === 0) {
                return <div className="text-sm text-gray-500 text-center py-4">No subjects found.</div>;
              }

              return uniqueSubjects.map((s, index) => {
                // Match reliably by subject details, ignoring _id variations for grouped MDM subjects
                const isSelected = selectedsubject && 
                  selectedsubject.subject === s.subject && 
                  selectedsubject.className === s.className &&
                  selectedsubject.division === s.division &&
                  selectedsubject.batch === s.batch;
                  
                return (
                  <label
                    key={`${s._id}-${s.subject}-${index}`}
                    onClick={() => typeof setselectedsubject === "function" && setselectedsubject(s)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="subject"
                      checked={isSelected}
                      readOnly
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {MDM.includes(s.subject) 
                          ? `${s.subject === "TGS" ? "TGS + AEGPS" : s.subject} (Theory + Practical)` 
                          : `${s.subject === "TGS" ? "TGS + AEGPS" : s.subject} (${s.subjectType})`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {s.className ?? "—"} {s.division ? `- ${s.batch ? s.batch : s.division}` : ""}
                      </div>
                    </div>
                  </label>
                );
              });
            })()}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarFilter;
