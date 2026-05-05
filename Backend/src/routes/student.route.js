import express from 'express';
import { createStudent, getAllStudents, getStudentsFiltered, getStudentSubmissionStatus, updateStudent, uploadStudentsFromExcel } from '../controllers/student.controller.js';
import upload from '../utils/multer.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/create',isLoggedIn, createStudent);
router.post('/filter',isLoggedIn, getStudentsFiltered);
router.patch('/update/:id', isLoggedIn, updateStudent);
router.post('/upload', isLoggedIn, upload.single("file"), uploadStudentsFromExcel);
router.get('/all', isLoggedIn, getAllStudents);
router.get('/submission-status', isLoggedIn, getStudentSubmissionStatus);

export default router;