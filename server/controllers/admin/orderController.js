import Order from "../../models/Order.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

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
export const getOrderDetailsForAdmin = async (req, res) => {
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

export const upadateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { updateStatus } = req.body;
    console.log(orderId, updateStatus);

    if (!orderId && !updateStatus) {
      return res.json({
        success: false,
        message: "Please provide orderId and update status",
      });
    }

    await Order.findByIdAndUpdate(orderId, { orderStatus: updateStatus });

    return res.json({
      success: true,
      message: "Order status is updated succesfully!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};
