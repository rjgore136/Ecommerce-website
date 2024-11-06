import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isLoading: true,
  productsList: [],
  productDetails: null,
};

export const fetchFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    // console.log("Fetch");

    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });
      const response = await axios.get(`${baseUrl}/shop/products/get?${query}`);
      // console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/shop/products/get/${id}`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state, action) => {
        // console.log(action);

        state.isLoading = true;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.productsList = action.payload.products;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        console.log(action);

        (state.isLoading = false), (state.productsList = []);
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        // console.log(action);

        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.productDetails = action.payload.product[0];
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        console.log(action);

        (state.isLoading = false), (state.productsList = []);
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
