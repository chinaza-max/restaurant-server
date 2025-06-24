import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import ViewStat from "../models/ViewStat.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const adminId = req.adminId;

    // --- Menu Item Stats ---
    const totalMenuItems = await MenuItem.countDocuments({ adminId });

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const newThisWeek = await MenuItem.countDocuments({
      adminId,
      createdAt: { $gte: startOfWeek }
    });

    // --- Category Stats ---
    const categories = await Category.find({ adminId });
    const totalCategories = categories.length;
    const categoryNames = categories.map(c => c.name).join(", ");

    // --- View Stats ---
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const year = now.getFullYear();
    const lastMonthYear = thisMonth === 1 ? year - 1 : year;

    const current = await ViewStat.findOne({ adminId, month: thisMonth, year });
    const previous = await ViewStat.findOne({ adminId, month: lastMonth, year: lastMonthYear });

    const views = current?.views || 0;
    const prevViews = previous?.views || 0;

    let percentChange = "0%";
    if (prevViews > 0) {
      const change = ((views - prevViews) / prevViews) * 100;
      percentChange = `${change.toFixed(2)}%`;
    } else if (views > 0) {
      percentChange = "+100%";
    }

    // --- Final formatted response array ---
    const dashboardStats = [
      {
        title: "Total Menu Items",
        value: totalMenuItems.toString(),
        description: `${newThisWeek} new this week`,
        icon: "FileText", // frontend can map this string to Lucide/Feather icon
        color: "text-blue-600"
      },
      {
        title: "Categories",
        value: totalCategories.toString(),
        description: categoryNames || "No categories",
        icon: "Users",
        color: "text-green-600"
      },
      {
        title: "Monthly Views",
        value: views.toLocaleString(),
        description: `${percentChange} from last month`,
        icon: "TrendingUp",
        color: "text-yellow-600"
      }
    ];

    res.json({
        data:dashboardStats
    });
  } catch (err) {
    console.error("❌ Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
