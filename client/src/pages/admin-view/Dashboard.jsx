import React, { useEffect } from "react";
import { useState } from "react";
import ProductImageUpload from "../../components/admin-view/Image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  addFeatureImage,
  deleteFeatureImg,
  getFeatureImages,
} from "@/store/common/featureSlice";
import { Heading1 } from "lucide-react";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImages } = useSelector((state) => state.feature);
  const { toast } = useToast();

  const dispatch = useDispatch();

  function handleFeatureImgUpload() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      // console.log(data);
      if (data?.payload?.success) {
        toast({
          title: "Image uploaded successfully",
        });
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        toast({
          title: "Image upload Failed!",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteImage(imgId) {
    // console.log(imgId);
    dispatch(deleteFeatureImg(imgId)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast({
          title: "Image deleted!",
          variant: "destructive",
        });
        dispatch(getFeatureImages());
      } else {
        toast({
          title: "Failed to delete! Please try after sometime!!",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);
  console.log("featureImages", featureImages);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleFeatureImgUpload} className={`w-full mt-5`}>
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImages && featureImages.length > 0 ? (
          featureImages.map((featureImage) => {
            return (
              // <div className="relative" key={featureImage._id}>
              //   <Button
              //     variant="destructive"
              //     className="mb-3"
              //     onClick={() => handleDeleteImage(featureImage._id)}
              //   >
              //     Delete
              //   </Button>
              //   <img
              //     src={featureImage?.image}
              //     alt={featureImage?.title}
              //     className="w-full h-[300px] object-cover rounded-t-lg"
              //   />
              // </div>
              <div className="relative group" key={featureImage._id}>
                <Button
                  variant="destructive"
                  className="mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                  onClick={() => handleDeleteImage(featureImage._id)}
                >
                  Delete
                </Button>
                <img
                  src={featureImage?.image}
                  alt={featureImage?.title}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            );
          })
        ) : (
          <h1>Currently no images are there on the banner</h1>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
