import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true ,index: true},
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String , required:false},
  price: { type: Number,required:false },
  description: { type: String , required:false},
  available: { type: Boolean, default: true },
},
  { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
