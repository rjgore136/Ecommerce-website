import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isLoading: true,
  productsList: [],
};

export const fetchFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    console.log("Fetch");

    try {
      const response = await axios.get(`${baseUrl}/shop/products/get`);
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state, action) => {
        console.log(action);

        state.isLoading = true;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.productsList = action.payload.products;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        console.log(action);

        (state.isLoading = false), (state.productsList = []);
      });
  },
});

export default shoppingProductSlice.reducer;
