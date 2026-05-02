import express from 'express';
import { createStudent, getStudentsFiltered, updateStudent, uploadStudentsFromExcel } from '../controllers/student.controller.js';
import upload from '../utils/multer.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
// create student,get student with filters,update student and upload student from excel

const router = express.Router();

router.post('/create',isLoggedIn, createStudent);
router.post('/filter',isLoggedIn, getStudentsFiltered);
router.patch('/update/:id', isLoggedIn, updateStudent);
router.post('/upload', isLoggedIn, upload.single("file"), uploadStudentsFromExcel);

export default router;