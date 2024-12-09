import userModel from "../models/userModel.js";

// Add a product to the user's wishlist
const addToWishlist = async (req, res) => {
  try {
    // console.log("adding to wishlist");

    const { userId, itemId, size } = req.body;

    // console.log("details : ", userId, itemId, size);

    const userData = await userModel.findById(userId);
    console.log("user data before", userData);

    let wishlist = userData.wishlist || {};

    if (wishlist[itemId]) {
      if (wishlist[itemId][size]) {
        wishlist[itemId][size] += 1;
      } else {
        wishlist[itemId][size] = 1;
      }
    } else {
      wishlist[itemId] = {};
      wishlist[itemId][size] = 1;
    }

    // console.log("Added successfully : ");

    await userModel.findByIdAndUpdate(userId, { wishlist });

    console.log("user data After", userData);
    res.json({ success: true, message: "Added to Wishlist" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).populate({
      path: "wishlist",
      populate: { path: "productId" }, // Ensure product details are populated
    });

    res.json({ success: true, wishlist: userData.wishlist });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    let wishlist = userData.wishlist || {};

    if (wishlist[itemId] && wishlist[itemId][size]) {
      delete wishlist[itemId][size];
      if (Object.keys(wishlist[itemId]).length === 0) {
        delete wishlist[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { wishlist });
    res.json({ success: true, message: "Removed from Wishlist" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToWishlist, getWishlist, removeFromWishlist };
