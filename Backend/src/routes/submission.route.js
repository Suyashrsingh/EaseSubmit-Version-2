import express from "express";
import { bulkUpdateSubmissionStatus, getAssignedStudentsForSubmission, postSubmission, undoSubmissionStatus } from "../controllers/submission.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/bulk-update", isLoggedIn, bulkUpdateSubmissionStatus);
router.get("/students", isLoggedIn, getAssignedStudentsForSubmission);

router.delete("/undo/:studentId", isLoggedIn, undoSubmissionStatus);
router.post("/:studentId", isLoggedIn, postSubmission);
export default router;