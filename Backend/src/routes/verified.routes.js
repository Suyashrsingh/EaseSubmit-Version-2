// import updateVerification 
import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { updateVerification } from '../controllers/verified.controller.js';

const router = express.Router();

router.put('/update', isLoggedIn, updateVerification);

export default router;