import mongoose from "mongoose";

const verifiedSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    coordinatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {   
        type: String,
        enum: ["Verified", "Not Verified"],
        default: "Not Verified"
    },
    verifiedAt: {
        type: Date,
    },
}, { timestamps: true });

const Verification = mongoose.model("Verification", verifiedSchema);

export default Verification;