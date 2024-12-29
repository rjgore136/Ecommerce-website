import paypal from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;
    // console.log(paypal);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();
        // console.log(paymentInfo);

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    console.log(paymentId, payerId, orderId);

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // for (let item of order.cartItems) {
    //   let product = await Product.findById(item.productId);

    //   if (!product) {
    //     return res.status(404).json({
    //       success: false,
    //       message: `Not enough stock for this product ${product.title}`,
    //     });
    //   }

    //   product.totalStock -= item.quantity;

    //   await product.save();
    // }

    const getCartId = order.cartId;
    // Clear items in the user's cart instead of deleting it
    const userCart = await Cart.findById(getCartId);
    if (userCart) {
      userCart.items = [];
      await userCart.save();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//get all orders by userId
export const getAllOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.json({
        success: false,
        message: "Please provide userId!!",
      });
    }

    const orders = await Order.find({ userId });

    if (!orders) {
      return res.json({
        success: false,
        message: "No orders found!!",
      });
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
  }
};

//get order details by order id
export const getOrderDetailsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.json({
        success: false,
        message: "Please provide order id!!",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found!!",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error.message);
  }
};
