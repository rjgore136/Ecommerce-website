import Filter from "@/components/shopping-view/Filter";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/productsSlice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";

const Listing = () => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const { productsList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);

  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [openProductDetails, setOpenProductDetails] = useState(false);

  const categoryParams = searchParams.get("category");

  function createSearchParams(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    // console.log("queryParams :", queryParams);

    return queryParams.join("&");
  }

  function handleSort(value) {
    console.log(value);
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    // console.log(getSectionId, getCurrentOption);
    let cpyFilters = { ...filters };
    const indexOfCurrentSecton = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSecton === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  //get productDetails
  function handleGetProductDetails(productId) {
    // console.log(productId);
    dispatch(fetchProductDetails(productId));
  }

  //add to cart
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

  //set sort and set filters
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categoryParams]);

  //set search params
  useEffect(() => {
    // console.log(searchParams);
    if (filters && Object.keys(filters).length > 0) {
      const createQuerySting = createSearchParams(filters);
      setSearchParams(new URLSearchParams(createQuerySting));
    }
  }, [filters]);

  //fetch filtered products
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  //setOpenPruductDetails(true) on basis of productDetails !== null
  useEffect(() => {
    if (productDetails !== null) setOpenProductDetails(true);
  }, [productDetails]);

  // console.log("fiters : ", filters);
  // console.log("searchParams : ", searchParams);
  // console.log("Prduct Details : ", productDetails);
  // console.log("cartItems:", cartItems);
  // console.log("ProductList", productsList);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <Filter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex  items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productsList?.length} Products
              {/* 10 Products */}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
          {/* Products container where we will render all the products using cards */}
          {productsList && productsList.length > 0
            ? productsList.map((product) => {
                return (
                  <ShoppingProductTile
                    key={product._id}
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                );
              })
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openProductDetails}
        setOpen={setOpenProductDetails}
        productDetails={productDetails}
      />
    </div>
  );
};

export default Listing;
