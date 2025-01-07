import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, resetSearchResults } from "@/store/shop/searchSlice";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import ShoppingProductTile from "./ProductTile";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "./product-details";
import { fetchProductDetails } from "@/store/shop/productsSlice";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const { productDetails } = useSelector((state) => state.shoppingProducts);
  console.log("searchResults", searchResults);

  useEffect(() => {
    if (keyword && keyword.trim() !== null && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams(``));
    }
  }, [keyword]);

  function handleAddtoCart(getCurrProductId, getTotalStock) {
    // console.log(getCurrProductId, totalStock);
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({ productId: getCurrProductId, userId: user.id, quantity: 1 })
    ).then((data) => {
      // console.log(data);
      if (data?.payload?.success) {
        toast({
          title: "Item added to cart",
        });
        dispatch(fetchCartItems(user?.id));
      }
    });
  }

  function handleGetProductDetails(productId) {
    // console.log(productId);
    dispatch(fetchProductDetails(productId));
  }

  //setOpenPruductDetails(true) on basis of productDetails !== null
  useEffect(() => {
    if (productDetails !== null) setOpenProductDetails(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex item-center">
          <Input
            className="py-6"
            placeholder="Search Products ..."
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      {!searchResults?.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults?.map((item) => (
          <ShoppingProductTile
            key={item?._id}
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openProductDetails}
        setOpen={setOpenProductDetails}
        productDetails={productDetails}
      />
    </div>
  );
};

export default SearchProducts;
