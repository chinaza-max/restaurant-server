import express from "express";
import upload from "../middleware/multer.js";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
} from "../controllers/menuItem.controller.js";
import authMiddleware  from "../middleware/auth.js";

const router = express.Router();

router.post("/create",authMiddleware, upload.single("image"), createMenuItem);
router.put("/:id",authMiddleware, upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.get("/",authMiddleware, getMenuItems);

export default router;
