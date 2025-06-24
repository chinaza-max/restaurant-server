import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};
