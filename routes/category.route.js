import express from "express";
import {
  createCategory,updateCategory,
  deleteCategory,getAllCategories,getMenuCategories
} from "../controllers/category.controller.js";
import authMiddleware  from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Define category routes here
// Example:
 router.post("/create",authMiddleware,upload.single("image"),  createCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.get("/", getAllCategories);
router.get("/", getAllCategories);
router.get('/menu/:type/categories/:adminId', getMenuCategories);


export default router;
