import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isLoading: false,
  cartItems: [],
};

//addToCart
export const addToCart = createAsyncThunk(
  "/cart/addToCart",
  async ({ productId, userId, quantity }) => {
    // console.log(productId, userId, quantity);

    try {
      // console.log("addToCart");
      const response = await axios.post(`${baseUrl}/shop/cart/add`, {
        productId,
        userId,
        quantity,
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

//fetchCartItems
export const fetchCartItems = createAsyncThunk(
  "/cart/fetchCartItems",
  async (userId) => {
    // console.log("fetchCartItems");
    try {
      const response = await axios.get(`${baseUrl}/shop/cart/get/${userId}`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

// updateCartItemQty
export const updateCartItemQty = createAsyncThunk(
  "/cart/updateCartItemQty",
  async ({ productId, userId, quantity }) => {
    // console.log("updateCartItemQty");
    try {
      const response = await axios.put(`${baseUrl}/shop/cart/update-cart`, {
        productId,
        userId,
        quantity,
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

//deleteProduct from cart
export const deleteCartItem = createAsyncThunk(
  "/cart/deleteCartItem",
  async ({ productId, userId }) => {
    // console.log("deleteCartItem");
    try {
      const response = await axios.delete(
        `${baseUrl}/shop/cart/${userId}/${productId}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //addToCart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(addToCart.rejected, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.cartItems = [];
      })
      //fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = [];
      })
      //updateCartItemQty
      .addCase(updateCartItemQty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = [];
      })
      //deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = action.payload.cart;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
