import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

import { bulkUpdateVerificationStatus, undoVerificationStatus, updateVerificationStatus } from '../controllers/verification.controller.js';


const router = express.Router();

router.put('/update', isLoggedIn, updateVerificationStatus);
router.post('/bulk-update', isLoggedIn, bulkUpdateVerificationStatus);
router.delete('/undo/:studentId', isLoggedIn, undoVerificationStatus);

export default router;