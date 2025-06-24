import Category from "../models/Category.js";
import cloudinary from "../utils/cloudinary.js";
import MenuItem from "../models/MenuItem.js";



const extractPublicId = (url) => {
  const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
  return match ? match[1] : null;
};

export const createCategory = async (req, res) => {
  try {
    const { name, generalCategory ,description} = req.body;
    let imageUrl = "";

    console.log("Admin ID:", req.adminId);
     
    if (req.file) {
      // Wrap cloudinary upload_stream in a Promise
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer); // push the image buffer
      });
    }
console.log(imageUrl)
    const category = await Category.create({
      adminId: req.adminId,
      name,
      image: imageUrl || "",  
      generalCategory,
      description
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("❌ Category creation error:", error);
    res.status(500).json({ message: "Failed to create category", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, generalCategory ,description} = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    let imageUrl = category.image;

    // Upload new image if provided
    if (req.file) {
      // Delete old image
      if (category.image) {
        const publicId = extractPublicId(category.image);
        if (publicId) await cloudinary.uploader.destroy(`categories/${publicId}`);
      }

      // Upload new image
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    category.name = name ?? category.name;
    category.generalCategory = generalCategory ?? category.generalCategory;
    category.image = imageUrl;
    category.description=description?? category.name;
    await category.save();

    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    console.error("❌ Category update error:", error);
    res.status(500).json({ message: "Failed to update category", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (category.image) {
      const publicId = extractPublicId(category.image);
      if (publicId) await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error("❌ Category deletion error:", error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.adminId) {
      filter.adminId = req.adminId;
    }

    const categories = await Category.find(filter);

    const formatted = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      description:cat.description||"No description available", // or you can add a description field to the schema
      image: cat.image,
      generalCategory: cat.generalCategory,
      adminId: cat.adminId.toString()
    }));

    res.status(200).json({
      data:formatted
    });
  } catch (error) {
    console.error("❌ Category fetch error:", error);
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};


export const getMenuCategories = async (req, res) => {
  try {
    const { adminId, type } = req.params;

    if (!["food", "drink"].includes(type)) {
      return res.status(400).json({ error: "Invalid menu type. Use 'food' or 'drink'." });
    }

    // Fetch categories for the admin and menu type
    const categories = await Category.find({ adminId, generalCategory: type });

    const result = await Promise.all(
      categories.map(async (category) => {
        const items = await MenuItem.find({
          category: category._id,
          adminId,
        }).select("name price description image");

        return {
          id: category._id.toString(),
          title: category.name,
          image: category.image || undefined,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
          })),
        };
      })
    );

    res.json({
      categories: result,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch menu data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/*
 async function test(){
    const adminId = "6856d09c698f816ff13f017d";

const drinkCategoryNames = [
  "Cocktails",
  "Shooters",
  "Poka Special",
  "Mocktails",
  "Shakes & Smoothies",
  "Fresh Fruit Juice & Drinks",
  "Beers",
  "Wines",
  "Spirits",
];

const drinkCategories = drinkCategoryNames.map((name) => ({
  adminId,
  name,
  generalCategory: "drink",
  image: "",
  description: "",
}));

const insertedCategories = await Category.insertMany(drinkCategories);
console.log("Drink categories inserted:", insertedCategories.map(c => `${c.name}: ${c._id}`));
}

setTimeout(() => {
  //test()
}, 3000);*/