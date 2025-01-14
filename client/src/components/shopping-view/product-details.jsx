import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/productsSlice";
import StarRating from "../common/StarRating";
import { useEffect, useState } from "react";
import { addReview, getAllReviews } from "@/store/shop/reviewSlice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  // console.log("productDetails:", productDetails);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { reviews } = useSelector((state) => state.reviews);
  const { toast } = useToast();
  const dispatch = useDispatch();

  // console.log(user);

  //handle add to cart
  function handleAddtoCart(getCurrProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    console.log(getCartItems);

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

  //add review
  function handleAddReview() {
    // console.log("handlwReview");

    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user.id,
        userName: user.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        dispatch(getAllReviews(productDetails._id));
        toast({
          title: "Reviewed successfully",
        });
      } else {
        toast({
          title: "Failed to review due to some error!!",
          variant: "destructive",
        });
      }
    });
  }

  //get rating
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  //handleDialogClose
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating("");
    setReviewMsg("");
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getAllReviews(productDetails?._id));
  }, [productDetails]);
  // console.log("Reviews", reviews);
  // console.log(productDetails);
  // className="grid lg:grid-cols-2  sm:grid-cols-1 sm:overflow-y-auto md:grid-cols-1 md:max-h-[90vh] md:overflow-y-auto gap-8 sm:p-14 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] sm:max-h-[90vh] lg:overflow-y-auto lg:p-4 md:p-10"

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid lg:grid-cols-2 sm:grid-cols-1 gap-8 p-10 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Title</DialogTitle>
        <DialogDescription className="sr-only">
          This is dialog desc
        </DialogDescription>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <h1 className="text-3xl font-bold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails?.description}
          </p>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRating rating={productDetails?.averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({productDetails?.averageReview})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddtoCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />

          {/* Review section */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length ? (
                reviews.map((review) => {
                  return (
                    <div className="flex gap-4" key={review._id}>
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {review.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{review.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRating rating={review.reviewValue} />
                        </div>
                        <p className="text-muted-foreground">
                          {review.reviewMessage}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h1>Be the first to review!</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRating
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
