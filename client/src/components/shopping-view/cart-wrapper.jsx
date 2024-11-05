import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "./cart-items-content";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";

const UserCartWrapper = ({ cartItems }) => {
  const { user } = useSelector((state) => state.auth);
  // const { cartItems } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();

  // console.log("cartitems: ", cartItems);

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
    <SheetContent className="sm:max-w-md overflow-y-auto">
      <DialogDescription className="sr-only">
        This is dialog DialogDescription
      </DialogDescription>
      <SheetHeader>
        <SheetTitle>User Cart</SheetTitle>
      </SheetHeader>
      {/* cart items */}
      <div className="mt-8 space-y-4">
        {cartItems?.items && cartItems?.items.length > 0 ? (
          cartItems?.items.map((item, index) => {
            return <UserCartItemsContent key={index} item={item} />;
          })
        ) : (
          <div className="w-full">Cart is empty!</div>
        )}
      </div>

      {/* checkout */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{totalCartAmt}</span>
        </div>
        <Button className="w-full mt-6">Proceed to Checkout</Button>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
