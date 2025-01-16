import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_baseUrl;

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
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

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(`${baseUrl}/auth/login`, formData, {
    withCredentials: true,
  });
  // console.log(response);
  return response.data;
});

// In case we are passing token in cookie
// export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
//   const response = await axios.get(`${baseUrl}/auth/check-auth`, {
//     withCredentials: true,
//     headers: {
//       "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//     },
//   });
//   return response.data;
// });

//In case we are passing token in headers and storing it in session storage
export const checkAuth = createAsyncThunk("/auth/checkauth", async (token) => {
  const response = await axios.get(`${baseUrl}/auth/check-auth`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
});

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    `${baseUrl}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    seUser: (builder) => {},
    resetTokenAndCredentials: (state) => {
      state.isAuthenticated = null;
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;
