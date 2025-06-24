import express from "express";
import {
  incrementView
} from "../controllers/user.controller.js";

const router = express.Router();


router.get("/:adminId", incrementView);

router.get("/ping/ping", (req, res) => {
  // You can perform your logic here, e.g., increment a counter
  console.log("Ping received, incrementing view count");

  // Then send a 200 OK response
  res.status(200).json({ message: "Ping successful, view incremented." });
});

  
export default router;
