import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/Form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/addressSlice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./AddressCard";
import { editProduct } from "@/store/admin/products-slice";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = () => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const { toast } = useToast();

  //handleManageAddress
  function handleManageAddress(e) {
    e.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add only 3 addresses!!",
        variant: "destructive",
      });
      return;
    }
    currentEditedId
      ? dispatch(
          editaAddress({
            userId: user.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          // console.log(data);
          toast({
            title: "Address edited successfully",
          });
          dispatch(fetchAllAddresses(user.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user.id,
          })
        ).then((data) => {
          // console.log(data);
          toast({
            title: "Address added successfully",
          });
          dispatch(fetchAllAddresses(user.id));
          setFormData(initialAddressFormData);
        });
  }

  //handleDeleteAddress
  function handleDeleteAddress(addressInfo) {
    dispatch(
      deleteAddress({ userId: user.id, addressId: addressInfo._id })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddresses(user.id));
        toast({
          title: "Address deleted successfully",
          variant: "destructive",
        });
      }
    });
  }

  //handleEditAddress
  function handleEditAddress(addressInfo) {
    setCurrentEditedId(addressInfo._id);
    setFormData({
      ...formData,
      address: addressInfo.address,
      city: addressInfo.city,
      phone: addressInfo.phone,
      pincode: addressInfo.pincode,
      notes: addressInfo.notes,
    });
  }

  //form validation
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user.id));
  }, [dispatch]);

  // console.log("addressList:", addressList);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddress) => (
              <AddressCard
                key={singleAddress._id}
                addressInfo={singleAddress}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          // buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
