import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  name: String,
  address: String,
  phone: String,
  logo: String,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
