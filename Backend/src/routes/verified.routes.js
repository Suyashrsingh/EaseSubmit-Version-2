import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { updateVerification } from '../controllers/verified.controller.js';
import { bulkUpdateVerificationStatus, undoVerificationStatus } from '../controllers/verification.controller.js';


const router = express.Router();

router.put('/update', isLoggedIn, updateVerification);
router.post('/bulk-update', isLoggedIn, bulkUpdateVerificationStatus);
router.delete('/undo/:studentId', isLoggedIn, undoVerificationStatus);

export default router;