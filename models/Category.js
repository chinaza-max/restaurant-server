import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true ,index: true},
  name: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String , required:false},
  generalCategory: { 
    type: String, 
    required: true,
    enum: ["food", "drink"] // ✅ Accept only 'food' or 'drink'
  },

},
  { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
