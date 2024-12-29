import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/orders/orderSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PaypalReturn = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  const dispatch = useDispatch();

  // console.log("PaymentId", paymentId);
  // console.log("PayerId", payerId);

  useEffect(() => {
    if (paymentId && payerId) {
      let currentOrderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      console.log("currentOrderId", currentOrderId);

      dispatch(
        capturePayment({ paymentId, payerId, orderId: currentOrderId })
      ).then((data) => {
        console.log(data);

        if (data?.payload.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please Wait!</CardTitle>
      </CardHeader>
    </Card>
  );
  C;
};

export default PaypalReturn;
