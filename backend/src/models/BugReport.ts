import mongoose from "mongoose"

const BugReportSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: { type: String }, // puedes guardar el email, handle, etc.
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("BugReport", BugReportSchema)