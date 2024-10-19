import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(`${baseUrl}/auth/register`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    seUser: (builder) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
