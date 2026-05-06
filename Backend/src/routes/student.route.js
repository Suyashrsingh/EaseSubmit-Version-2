import express from 'express';
import { createStudent, getAllStudents, getStudentsFiltered, getStudentSubmissionStatus, getStudentsByClass, updateStudent, uploadStudentsFromExcel } from '../controllers/student.controller.js';
import upload from '../utils/multer.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/create', isLoggedIn, createStudent); // working
router.post('/filter', isLoggedIn, getStudentsFiltered); // working
router.patch('/update/:id', isLoggedIn, updateStudent);
router.post('/upload', isLoggedIn, upload.single("file"), uploadStudentsFromExcel);// working
router.post('/all', isLoggedIn, getAllStudents); // working
router.post('/submission-status', isLoggedIn, getStudentSubmissionStatus); // working
router.post('/by-class', isLoggedIn, getStudentsByClass); // get all students of a class across divisions

export default router;