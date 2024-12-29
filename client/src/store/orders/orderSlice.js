import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  approvalURL: "",
  isLoading: false,
  orderId: null,
};

//create new order
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${baseUrl}/shop/order/create`,
      orderData
    );
    // console.log(response);

    return response.data;
  }
);

//capture payment and update order payment status
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    console.log("capturePayment");

    console.log("PaymentId", paymentId);
    console.log("PayerId", payerId);
    console.log("currentOrderId", orderId);
    const response = await axios.post(`${baseUrl}/shop/order/capture`, {
      paymentId,
      payerId,
      orderId,
    });
    console.log(response);

    return response.data;
  }
);

//get all orders using user id
export const getAllOrders = createAsyncThunk(
  "/order/getAllOrders",
  async (userId) => {
    console.log("getAllOrders");
    const response = await axios.post(
      `${baseUrl}/shop/order/list-orders/${userId}`
    );

    console.log("Orders", response.data);
    return response.data;
  }
);

//get order details using order id
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (orderId) => {
    const response = await axios.post(
      `${baseUrl}/shop/order/order-details/${orderId}`
    );

    console.log("Order details", response.data);
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        // console.log(action);
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        console.log(action);
      });
  },
});

export default shoppingOrderSlice.reducer;
