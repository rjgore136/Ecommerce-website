import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isLoading: false,
  reviews: [],
};

//async thunk to add review
export const addReview = createAsyncThunk(
  "/shop/addReview",
  async ({ productId, userId, userName, reviewMessage, reviewValue }) => {
    console.log("addReview");

    const response = await axios.post(`${baseUrl}/shop/reviews/add`, {
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    return response.data;
  }
);

//fetch reviews
export const getAllReviews = createAsyncThunk(
  "/shop/getAllReviews",
  async (productId) => {
    console.log("getAllReviews");
    const response = await axios.get(`${baseUrl}/shop/reviews/${productId}`);
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
