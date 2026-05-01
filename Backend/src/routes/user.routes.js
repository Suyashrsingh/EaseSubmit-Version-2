import express from "express"
import { changePassword, login, registerUser } from "../controllers/users.controllers.js"
// import {isLoggedIn} from "../middleware/auth.middleware.js"
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',login)
// router.post('/change-password',isLoggedIn,changePassword);


export default router