import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import adminProductsReducer from "./admin/products-slice.js";
import shoppingProductsReducer from "./shop/productsSlice.js";
import shoppingCartReducer from "./shop/cartSlice.js";
import addressReducer from "./shop/addressSlice.js";
import shopOrderReducer from "./orders/orderSlice.js";
import adminOrderReducer from "./admin/orderSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shoppingProducts: shoppingProductsReducer,
    shoppingCart: shoppingCartReducer,
    address: addressReducer,
    shopOrder: shopOrderReducer,
    adminOrder: adminOrderReducer,
  },
});

export default store;
