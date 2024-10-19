import React from "react";
import AuthLayout from "./components/auth/Layout";
import { Route, Routes } from "react-router-dom";
import AuthLogin from "./pages/auth/Login";
import AuthRegister from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminOrders from "./pages/admin-view/Orders";
import AdminProducts from "./pages/admin-view/Products";
import ShoppingLayout from "./components/shopping-view/Layout";
import NotFound from "./pages/Not-found/NotFound";
import ShopHome from "./pages/shopping-view/Home";
import Account from "./pages/shopping-view/Account";
import Listing from "./pages/shopping-view/Listing";
import Checkout from "./pages/shopping-view/Checkout";
import CheckAuth from "./components/common/CheckAuth";
import UnAuth from "./pages/unauth-page/UnAuth";

const App = () => {
  const isAuthenticated = false;
  const user = {
    name: "Ritesh",
    role: "user",
  };
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* auth */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* admin */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* shopping */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShopHome />} />
          <Route path="account" element={<Account />} />
          <Route path="listing" element={<Listing />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Not found */}
        <Route path="/*" element={<NotFound />} />

        {/* Unauthorize page */}
        <Route path="/unauth-page" element={<UnAuth />} />
      </Routes>
    </div>
  );
};

export default App;