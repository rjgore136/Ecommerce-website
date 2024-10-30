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
import { fetchFilteredProducts } from "@/store/shop/productsSlice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";

const Listing = () => {
  const [sort, setSort] = useState(null);
  const { productsList } = useSelector((state) => state.shoppingProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilteredProducts());
  }, [dispatch]);

  function handleSort() {}
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <Filter />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {/* Products container where we will render all the products using cards */}
          {productsList && productsList.length > 0
            ? productsList.map((product) => {
                return (
                  <ShoppingProductTile key={product._id} product={product} />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Listing;
