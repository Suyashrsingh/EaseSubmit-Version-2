import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { subjectsSY, subjectsTY } from "../utils/subjects.js";

export const getSubjects = asyncHandler(async(req,res) => {
    const year = req.query.year;

    if (!year) {
        return res.status(400).json(new ApiResponse(400, null, "Year is required"));
    }

    let subjects;
    if (year === "SY") {
        subjects = subjectsSY;
    } else if (year === "TY") {
        subjects = subjectsTY;
    } else {
        return res.status(400).json(new ApiResponse(400, null, "Invalid year"));
    }

    return res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});