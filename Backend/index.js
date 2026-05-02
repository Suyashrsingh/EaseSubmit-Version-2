import express from "express";
import cors from "cors";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import { connectDB } from "./src/utils/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./src/utils/api-response.js";


// import all routes
import healthCheckRoutes from "./src/routes/healthCheck.route.js";
import userRoutes from "./src/routes/user.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import teacherRoutes from "./src/routes/teacher.route.js";
import studentRoutes from "./src/routes/student.route.js";
import verifiedRoutes from "./src/routes/verified.routes.js";
import submissionRoutes from "./src/routes/submission.routes.js";

dotenv.config();
const PORT = process.env.PORT || 8080
const app = express();  
app.use(cors());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// all routes
app.use("/api/v1/health",healthCheckRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/subjects", subjectRoutes)
app.use("/api/v1/teachers", teacherRoutes)
app.use('/api/v1/students', studentRoutes)
app.use("/api/v1/verification",verifiedRoutes)
app.use("/api/v1/submissions", submissionRoutes)

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

app.use(errorMiddleware);