import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cartSlice.js";
import { useToast } from "@/hooks/use-toast";

const UserCartItemsContent = ({ item }) => {
  // console.log(item);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQty(item, type) {
    dispatch(
      updateCartItemQty({
        productId: item.productId,
        userId: user.id,
        quantity: type === "Plus" ? item.quantity + 1 : item.quantity - 1,
      })
    );
  }

  function handleDeleteCartItem(getItem) {
    dispatch(
      deleteCartItem({ productId: getItem.productId, userId: user.id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          variant: "destructive",
          title: "Cart item deleted successfully!",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4 overflow-y-auto">
      <img
        src={item?.image}
        alt="item?.title"
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={item?.quantity === 1}
            onClick={() => {
              handleUpdateQty(item, "Minus");
            }}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{item?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              handleUpdateQty(item, "Plus");
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ₹
          {(
            (item?.salePrice > 0 ? item.salePrice : item.price) * item?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleDeleteCartItem(item)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;
