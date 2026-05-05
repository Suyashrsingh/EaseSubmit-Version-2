import express from "express";
import { bulkUpdateSubmissionStatus, getAssignedStudentsForSubmission, postSubmission, undoSubmissionStatus } from "../controllers/submission.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:studentId", isLoggedIn, postSubmission);
router.delete("/undo/:studentId", isLoggedIn, undoSubmissionStatus);
router.post("/bulk-update", isLoggedIn, bulkUpdateSubmissionStatus);
router.get("/students", isLoggedIn, getAssignedStudentsForSubmission);

export default router;