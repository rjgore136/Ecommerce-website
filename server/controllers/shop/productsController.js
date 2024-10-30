import Product from "../../models/Product.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products: products,
    });
  } catch (error) {
    console.log(e);
    res.json({
      success: false,
      message: "Failed to fetch the products!!",
    });
  }
};
