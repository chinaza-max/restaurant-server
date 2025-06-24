// models/ViewStat.js
import mongoose from "mongoose";

const viewStatSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  month: { type: Number, required: true }, // e.g., 6 = June
  year: { type: Number, required: true },
  views: { type: Number, default: 0 }
});

viewStatSchema.index({ adminId: 1, month: 1, year: 1 }, { unique: true });

const ViewStat = mongoose.model("ViewStat", viewStatSchema);
export default ViewStat;
