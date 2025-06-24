import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
//import "./utils/cloudinary.js"
// Routes
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import menuItemRoutes from "./routes/menuItem.route.js";
import uploadRoutes from "./routes/upload.route.js";
import restaurantRoutes from "./routes/restaurant.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import userRoutes from "./routes/user.route.js";


dotenv.config();
connectDB();



const app = express();
//app.use(cors({ credentials: true, origin: true }));


const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081","https://restaurant-server-menu.onrender.com"
  ,"https://turbo-menu.netlify.app" ,"fido-menu-panel.netlify.app"// <-- Add more domains as needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
