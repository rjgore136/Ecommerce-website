import React, { useEffect, useState } from "react";
import banner1 from "../../assets/banner-1.webp";
import banner2 from "../../assets/banner-2.webp";
import banner3 from "../../assets/banner-3.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/productsSlice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { addToCart } from "@/store/shop/cartSlice";
import { fetchCartItems } from "@/store/shop/cartSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const ShopHome = () => {
  const slides = [banner1, banner2, banner3];
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productsList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  // automatic slide change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  //filter using category and redirect to listing page
  function handleNavigateToListingPage(currentItem, section) {
    sessionStorage.removeItem("filters");
    const currFilters = { [section]: [currentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currFilters));
    navigate("/shop/listing");
  }

  //get productDetails
  function handleGetProductDetails(productId) {
    console.log(productId);
    dispatch(fetchProductDetails(productId));
  }

  //add to cart
  function handleAddtoCart(getCurrProductId, totalStock) {
    // console.log(getCurrProductId, totalStock);
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

  //fetchFilteredProducts
  useEffect(() => {
    dispatch(
      fetchFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, []);

  //setOpenPruductDetails(true) on basis of productDetails !== null
  useEffect(() => {
    if (productDetails !== null) setOpenProductDetails(true);
  }, [productDetails]);

  // console.log("ProductList:", productsList);

  return (
    <div className="flex flex-col min-h-sreen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => {
          return (
            <img
              src={slide}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover
              transition-opacity duration-1000`}
            />
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-1/2 left-4 transform-y-1/2 bg-white/80`}
          onClick={() => {
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            );
          }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-1/2 right-4 transform-y-1/2 bg-white/80`}
          onClick={() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
          }}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* categories with icon */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* brands with icon */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* rendering products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsList && productsList.length > 0
              ? productsList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openProductDetails}
        setOpen={setOpenProductDetails}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShopHome;
