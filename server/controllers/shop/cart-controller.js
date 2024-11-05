import Product from "../../models/Product.js";
import Cart from "../../models/Cart.js";

//add to cart
export const addToCart = async (req, res) => {
  const { productId, userId } = req.body;
  let quantity = Number(req.body.quantity);

  // console.log("productId", productId, "userId", userId, "quantity", quantity);

  try {
    if (!productId || !userId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!!",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const indexOfCurrProduct = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (indexOfCurrProduct === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[indexOfCurrProduct].quantity += quantity;
    }

    await cart.save();

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const fetchCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      title: item.productId.title,
      productId: item.productId._id,
      image: item.productId.image,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.json({
      success: true,
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: `Failed to fetch cart items due to - ${error.message}`,
    });
  }
};

export const updateCartItemQty = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    let quantity = Number(req.body.quantity);

    console.log(productId, userId, quantity);

    if (!productId || !userId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({
        success: false,
        message: "Cart not found!",
      });
    }

    const indexOfCurrProduct = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (indexOfCurrProduct === -1) {
      return res.json({
        success: false,
        message: "Item is not present in the cart!!",
      });
    }

    cart.items[indexOfCurrProduct].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
