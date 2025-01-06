import Product from "../../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword && typeof keyword !== "string") {
      return res.json({
        success: false,
        message: "keyword is required and must be string",
      });
    }

    const reqEx = new RegExp(keyword, "i");
    console.log(reqEx);

    const createSearchQuery = {
      $or: [
        { title: reqEx },
        { description: reqEx },
        { category: reqEx },
        { brand: reqEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
