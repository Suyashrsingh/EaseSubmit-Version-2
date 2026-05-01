import mongoose from "mongoose";

const teacherAllocationSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    class: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    subjectType: {
        type: String,
        enum: ["Theory", "Practical"],
        required: true
    },
    batch: {
        type: String
    }
}, { timestamps: true });

const TeacherAllocation = mongoose.model("TeacherAllocation", teacherAllocationSchema);

export default TeacherAllocation;