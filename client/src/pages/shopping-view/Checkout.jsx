import React from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/Address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart);

  const totalCartAmt =
    cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, item) => {
          return (
            sum +
            (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity
          );
        }, 0)
      : 0;
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, index) => (
                <UserCartItemsContent key={index} item={item} />
              ))
            : "Cart is empty"}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmt}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button className="w-full">Checkout With Paypal</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
