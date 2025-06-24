import Restaurant from "../models/Restaurant.js";

export const createOrUpdateRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ adminId: req.adminId });
    if (existing) {
      const updated = await Restaurant.findOneAndUpdate(
        { adminId: req.adminId },
        req.body,
        { new: true }
      );
      res.json(updated);
    } else {
      const created = await Restaurant.create({ ...req.body, adminId: req.adminId });
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId: req.adminId });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
