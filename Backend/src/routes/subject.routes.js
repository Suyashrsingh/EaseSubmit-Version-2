import express from "express";
import { getSubjects } from "../controllers/subjects.controller.js";

const router = express.Router();

router.get("/subjects", getSubjects);

export default router;