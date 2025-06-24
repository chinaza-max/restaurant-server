import MenuItem from "../models/MenuItem.js";
import cloudinary from "../utils/cloudinary.js";


const extractPublicId = (url) => {
  const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
  return match ? match[1] : null;
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let imageUrl = "";

    console.log("Admin ID:", req.adminId);

    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "menu" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer); // SAME AS CATEGORY
      });
    }

    const newItem = await MenuItem.create({
      name,
      price,
      category,
      description,
      adminId: req.adminId,
      image: imageUrl || ""
    });

    res.status(201).json({ message: "Menu item created", item: newItem });
  } catch (err) {
    console.error("❌ Create Menu Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, price, category, description ,available="true", removeImage="false"} = req.body;
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: "Item not found" });

    let imageUrl = menuItem.image;


    if (removeImage === "true" && menuItem.image) {
      const publicId = extractPublicId(menuItem.image);
      if (publicId) await cloudinary.uploader.destroy(`menu/${publicId}`);
      imageUrl = ""; // Clear image URL
    }


    if (req.file) {

      if (menuItem.image) {
        const publicId = extractPublicId(menuItem.image);
        if (publicId) await cloudinary.uploader.destroy(`menu/${publicId}`);
      }

      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "menu" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    menuItem.name = name ?? menuItem.name;
    menuItem.price = price ?? menuItem.price;
    menuItem.category = category ?? menuItem.category;
    menuItem.description = description ?? menuItem.description;
    menuItem.image = imageUrl;
    menuItem.available = available=="true"? true :false;


    await menuItem.save();

    res.status(200).json({ message: "Menu item updated", item: menuItem });
  } catch (err) {
    console.error("❌ Update Menu Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: "Item not found" });

    if (menuItem.image) {
      const publicId = extractPublicId(menuItem.image);
      if (publicId) await cloudinary.uploader.destroy(`menu/${publicId}`);
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu item deleted" });
  } catch (err) {
    console.error("❌ Delete Menu Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ adminId: req.adminId }).populate("category");

    const formatted = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      description: item.description,
      available: item.available ?? true, // fallback to true if not stored
      category: item.category?._id?.toString() || null,
      generalCategory: item.category?.generalCategory || null,
      adminId: item.adminId.toString()
    }));

    res.status(200).json({
      data:formatted
    });
  } catch (err) {
    console.error("❌ Fetch menu items error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



/*
async function test(){
 const adminId = "6856d09c698f816ff13f017d";

const categoryMap = {
  "Cocktails": "68588efa59b9fdd9d443d864",
  "Shooters": "68588efa59b9fdd9d443d865",
  "Poka Special": "68588efa59b9fdd9d443d866",
  "Mocktails": "68588efa59b9fdd9d443d867",
  "Shakes & Smoothies": "68588efa59b9fdd9d443d868",
  "Fresh Fruit Juice & Drinks": "68588efa59b9fdd9d443d869",
  "Beers": "68588efa59b9fdd9d443d86a",
  "Wines": "68588efa59b9fdd9d443d86b",
  "Spirits": "68588efa59b9fdd9d443d86c"
};

const drinkData = {
  "Cocktails": [
    { name: "DAIQUIRI (STRAWBERRY OR PINEAPPLE)", description: "Bacardi lite rum, lime Juice with simple syrup and flavor of choice", price: 10000 },
    { name: "WHISKEY SOUR", description: "Whiskey, Sour Mix, Simple Syrup", price: 10000 },
    { name: "LONG ISLAND (ICED TEA)", description: "Bacardi, Gin, Vodka, Tequila, Triple Sec, Cointreau, Juice of Lemon, Garnish", price: 10000 },
    { name: "ADIOS MOTHER-FUCKER", description: "Baileys, Milk, Vodka, Kahlua and Ice", price: 10000 },
    { name: "SCREAMING ORGASM", description: "Vodka, Coffee Liqour, Amaretto, Baileys and Milk", price: 10000 },
    { name: "SKY RAINBOW", description: "Grenadine Ice, Pineapple Juice, Malibu and Blue Curacao", price: 10000 }
  ],
  "Shooters": [
    { name: "THE NUTTY IRISHMAN", description: "Baileys Irish Cream with Caramel Peanut Rim", price: 3500 },
    { name: "JAGER - BOMB", description: "Jaegermeister with red bull and a hint of basil", price: 3500 },
    { name: "CINCO DE TEQUILA", description: "Spicy-salt rimmed shot of tequila with lime", price: 3500 },
    { name: "THE SNAKEBITE SHOT", description: "Jack and Lime cordial potent shooter", price: 3500 },
    { name: "MAGIC MIKE", description: "Gin and Blueberry Shot", price: 3500 },
    { name: "THE FLAMING GERMAN", description: "Brown rum, cinnamon liqueur, dash of Jager", price: 3500 },
    { name: "KAMIKAZE", description: "Triple sec, vodka and lime juice shot", price: 3500 }
  ],
  "Poka Special": [
    { name: "JAMBA", description: "Tequila, Orange, Cranberry, Pineapple Juice, Grenadine", price: 8000 },
    { name: "GOOD ol' FASHION", description: "Whiskey, Simple Syrup, Bitters, Brulee Orange", price: 8000 },
    { name: "STRAWBERRY MARGARITA", description: "Strawberry Syrup, Tequila, Lime, Triple Sec, Honey", price: 8000 }
  ],
  "Mocktails": [
    { name: "CHAPMAN", description: "Fanta, Spirit, Orange Juice, Grenadine, Bitters", price: 8000 },
    { name: "PINK LADY", description: "Apple, Pineapple, Coconut, Yoghurt, Grenadine", price: 8000 },
    { name: "CLASSIC LEMONADE", description: "Lemon Juice, Simple Syrup, Soda water", price: 8000 },
    { name: "AFTER GLOW", description: "Orange Juice, Pineapple Juice", price: 8000 },
    { name: "POKA SPECIAL", description: "Pineapple, Banana, Watermelon, Milk, Ice", price: 8000 },
    { name: "VIRGIN COSMO", description: "Cranberry, Lime Juice, Soda, Ice", price: 8000 },
    { name: "BLUE LAGOON", description: "Blue Curacao, Lemon Juice, Sprite, Ice", price: 8000 },
    { name: "FRUIT PUNCH", description: "Blended Watermelon, Banana, Apple", price: 8000 }
  ],
  "Shakes & Smoothies": [
    { name: "OREOS-CHOCOLATE", description: "Oreos, Ice-cream, Whipping cream, milk and Chocolate", price: 8000 },
    { name: "VANILLA", description: "Vanilla Ice-cream, milk, Whipping cream", price: 8000 },
    { name: "STRAWBERRY", description: "Strawberry, Ice-cream, Whipping cream, milk", price: 8000 },
    { name: "BANANA AND PEANUT BUTTER", description: "Banana, Peanut butter, Honey, Milk, Cinnamon", price: 8000 }
  ],
  "Fresh Fruit Juice & Drinks": [
    { name: "Watermelon", price: 5000 },
    { name: "Pineapple", price: 5000 },
    { name: "Ginger Pineapple", price: 5000 },
    { name: "Mix", description: "Choose your mix", price: 5000 },
    { name: "Apple Juice Box", price: 4500 },
    { name: "Orange Juice Box", price: 4500 },
    { name: "Pineapple Juice Box", price: 4500 },
    { name: "Coke", price: 1000 },
    { name: "Malt", price: 1500 },
    { name: "Monster", price: 2500 },
    { name: "Blue Bullet", price: 2500 },
    { name: "Odogwu Malay", price: 2500 },
    { name: "Origin Bitter", price: 2500 },
    { name: "Black Bullet", price: 3000 },
    { name: "Odogwu Hammer", price: 3000 },
    { name: "Water", price: 1000 }
  ],
  "Beers": [
    { name: "Drought", price: 3000 },
    { name: "Budweiser", price: 3000 },
    { name: "Guinness Stout (Small)", price: 3000 },
    { name: "Tiger", price: 2000 },
    { name: "Star Radler", price: 1500 },
    { name: "Smirnoff Ice", price: 1500 },
    { name: "Smirnoff Ice (Double Black)", price: 1500 },
    { name: "Heineken (bottle)", price: 3000 }
  ],
  "Wines": [
    { name: "Escudo Rojo", price: 40000 },
    { name: "Nederburg", price: 25000 },
    { name: "Lamonthe Parrot", price: 20000 },
    { name: "Carlo Rossi", price: 20000 },
    { name: "Four Cousins", price: 20000 },
    { name: "Sweet Lips", price: 20000 },
    { name: "4th Street", price: 20000 },
    { name: "Expression", price: 20000 },
    { name: "Four Cousins (White)", price: 20000 },
    { name: "4th Street (White)", price: 20000 },
    { name: "Expression (White)", price: 20000 }
  ],
  "Spirits": [
    
    { name: "Whiskey" },
    { name: "Glenfiddich (23 Years)", price: 800000 },
    { name: "Glenfiddich (21 Years)", price: 500000 },
    { name: "Glenfiddich (18 Years)", price: 250000 },
    { name: "Glenfiddich (15 Years)", price: 150000 },
    { name: "Glenfiddich (12 Years)", price: 100000 },
    { name: "Blue Label", price: 500000 },
    { name: "Jameson Black", price: 80000 },
    { name: "Black Label", price: 100000 },
    { name: "White Walker", price: 50000 },
    { name: "Macallan (12 Years)", price: 150000 },
    { name: "Singleton", price: 120000 },
    { name: "Monkey Shoulder", price: 70000 },
    { name: "Jack Daniels", price: 50000 },
    { name: "Grant's Triple Wood (12 Years)", price: 50000 },
    { name: "Fisher's 88", price: 15000 },
    { name: "Ponche", price: 10000 },
    { name: "Jameson Green", price: 50000 },
    
        { name: "Cognac" },
    { name: "Hennessy XO", price: 600000 },
    { name: "Hennessy VSOP", price: 180000 },
    { name: "Hennessy VS", price: 110000 },
    { name: "Remy Martins 1738", price: 180000 },
    { name: "Remy Martins VSOP", price: 140000 },
    { name: "Martel Blueswift", price: 150000 },
    { name: "Martel VS", price: 100000 },
      { name: "Liqueurs" },
    { name: "Clase Azul", price: 500000 },
    { name: "Jagermeister", price: 30000 },
    { name: "Olmeca Tequila", price: 60000 },
    { name: "Gordon's Dry Gin", price: 30000 },
    { name: "Campari", price: 30000 },
    { name: "Cream Liqueurs" },
    { name: "Baileys", price: 50000 },
    
    { name: "Vodka" },
    { name: "Absolut (All Flavours)", price: 35000 }
  ]
};

const menuItems = Object.entries(drinkData).flatMap(([cat, items]) =>
  items.map(item => ({
    adminId,
    category: categoryMap[cat] || categoryMap["Spirits"], // fall back for all Cognac, Vodka, etc.
    name: item.name,
    description: item.description || "",
    price: item.price,
    image: "",
    available: true
  }))
);

await MenuItem.insertMany(menuItems);
console.log("✅ Drink menu items inserted:", menuItems.length);
}*/

setTimeout(() => {
  //test()
}, 3000);