import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isLoading: false,
  featureImages: [],
};

//add feature image
export const addFeatureImage = createAsyncThunk(
  "/feature/addFeatureImage",
  async (image) => {
    console.log("addFeatureImage");

    const response = await axios.post(`${baseUrl}/common/feature/add`, {
      image,
    });

    return response.data;
  }
);

//get all feature images
export const getFeatureImages = createAsyncThunk(
  "/feature/getFeatureImages",
  async (image) => {
    console.log("getFeatureImages");

    const response = await axios.get(`${baseUrl}/common/feature/get`);

    return response.data;
  }
);

//delete a feature image
export const deleteFeatureImg = createAsyncThunk(
  "feature/deleteFeatureImage",
  async (imgId) => {
    console.log("deleteFeatureImg");
    const response = await axios.delete(`${baseUrl}/common/feature/${imgId}`);
    return response.data;
  }
);

export const featureSlice = createSlice({
  name: "featureSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.featureImages = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImages = [];
      });
  },
});

export default featureSlice.reducer;
