import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { shoppingViewHeaderMenuItems } from "@/config";
import { fetchCartItems } from "@/store/shop/cartSlice";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth/authSlice.js";
import UserCartWrapper from "./cart-wrapper.jsx";

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  //get products by header options
  function handleNavigateToListingPage(currentItem) {
    console.log(currentItem.id);

    sessionStorage.removeItem("filters");
    const currFilters =
      currentItem.id !== "home" && currentItem.id !== "products"
        ? { category: [currentItem.id] }
        : null;

    console.log(currFilters);

    sessionStorage.setItem("filters", JSON.stringify(currFilters));
    location.pathname.includes("listing") && currFilters !== null
      ? setSearchParams(new URLSearchParams(`?category=${currentItem.id}`))
      : navigate(currentItem.path);
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row sm:mt-5 sm:ml-7">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => {
            handleNavigateToListingPage(menuItem);
          }}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  // console.log(cartItems);

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 sm:flex-row mt-0 sm:mt-[80%] lg:mt-0">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          cartItems={cartItems}
          setOpenCartSheet={setOpenCartSheet}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar
            className={`bg-black items-center justify-center cursor-pointer`}
          >
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="w-56 mt-4 mr-2 sm:m-4">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-2">
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Ecommerce</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <DialogTitle className="sr-only">
                  Toggle Header Menu
                </DialogTitle>
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <DialogDescription className="sr-only">
                This is the menu
              </DialogDescription>
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to="/shop/home"
                    className="flex items-center gap-2 sm:mt-0"
                  >
                    <HousePlug className="h-6 w-6" />
                    <span className="font-bold">Ecommerce</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </header>
    </>
  );
};

export default ShoppingHeader;
