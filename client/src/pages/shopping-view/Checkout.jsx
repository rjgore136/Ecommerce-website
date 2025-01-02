import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/Address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/orders/orderSlice";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currSelectedAddress, setCurrSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmt =
    cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, item) => {
          return (
            sum +
            (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity
          );
        }, 0)
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty!!",
      });

      return;
    }

    if (currSelectedAddress === null) {
      toast({
        variant: "destructive",
        title: "Please select any one address to proceeed!!",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      userName: user?.userName,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((cartItem) => ({
        productId: cartItem?.productId,
        title: cartItem?.title,
        image: cartItem?.image,
        price: cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price,
        quantity: cartItem?.quantity,
      })),
      addressInfo: {
        addressId: currSelectedAddress._id,
        address: currSelectedAddress.address,
        city: currSelectedAddress.city,
        pincode: currSelectedAddress.pincode,
        phone: currSelectedAddress.phone,
        notes: currSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "Paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmt,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    console.log("Order Data:", orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        setPaymentStarted(true);
      } else {
        setPaymentStarted(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  // console.log(currSelectedAddress);
  // console.log(cartItems);

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
        <Address setCurrSelectedAddress={setCurrSelectedAddress} />
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
            <Button className="w-full" onClick={handleInitiatePaypalPayment}>
              Checkout With Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
