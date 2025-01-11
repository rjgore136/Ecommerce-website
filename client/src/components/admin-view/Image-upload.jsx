import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { handler } from "tailwindcss-animate";
import { SelectLabel } from "../ui/select";
import { UploadCloudIcon, FileIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const baseUrl = import.meta.env.VITE_baseUrl;
  const imageRef = useRef();

  function handleUploadFile(e) {
    console.log(e.target.files);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
    console.log(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (imageRef.current) {
      console.log(imageRef.current.value);
      imageRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        `${baseUrl}/admin/products/upload-image`,
        data
      );

      console.log(response.data);
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto mt-4"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={handleUploadFile}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon
              className={`w-10 h-10 text-muted-foreground mb-2`}
            />
            <span>Drag and drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className={`h-10 bg-gray-100`} />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
