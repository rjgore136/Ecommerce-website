import Product from "../../models/Product.js";

export const getFilteredProducts = async (req, res) => {
  const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

  try {
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);
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
