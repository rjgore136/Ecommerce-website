import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    console.log(productId, userId, userName, reviewMessage, reviewValue);

    //finding the order of user with userId to make sure that he has bought this product to review it
    //we used dot notation to access nested documents of order model
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId, //dot notation
      orderStatus: "confirmed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it...",
      });
    }

    //if user have already reviewed this product , then he can't review it again
    const checkExistingReview = await Review.findOne({ productId, userId });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!!",
      });
    }

    const newReview = new Review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await Review.find({ productId });
    const averageReview =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.reviewValue, 0) /
          reviews.length
        : 0;

    console.log(averageReview);

    await Product.findByIdAndUpdate(productId, {
      averageReview,
    });

    res.status(201).json({
      success: true,
      data: newReview,
      message: "Review posted!",
    });
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
    });
  }
};

//get all the reviews of particular product
export const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.json({
        success: false,
        message: "Please provide productId!!",
      });
    }

    const reviews = await Review.find({ productId });
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
