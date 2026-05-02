import mongoose from "mongoose";



const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: { 
        type: String,
        required: true,
        unique: true
    },
    className: {
        type: String,
        required: true  
    },
    division: {
        type: String,
    },
    subjects: [{
        type: String,
    }],
    batch: {
        type: String,
    },
    finalVerification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification"
    },
    submission:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission"
    },
    isFinalSubmitted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;