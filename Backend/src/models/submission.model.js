import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
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
    className:{
        type: String,
        required: true
    },
    division:{
        type: String,
        required: true
    },
    batch:{
        type: String,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum: ["Submitted", "Not Submitted"],
        default: "Not Submitted"
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;