import express from "express";
import {isLoggedIn} from "../middlewares/auth.middleware.js"
import { allocateTeacher, getTeachers, teacherForSubjects } from "../controllers/teacher.controller.js";

const router = express.Router()

router.get("/",isLoggedIn,getTeachers)
router.post("/allocate/:teacherId",isLoggedIn,allocateTeacher)
router.get("/get-subject-teacher",isLoggedIn,teacherForSubjects)

export default router;