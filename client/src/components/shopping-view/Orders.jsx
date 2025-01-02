import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import ShopOrdersDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getAllOrders,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/orders/orderSlice";
import { Badge } from "../ui/badge";

const Orders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrders(user.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log("OrderDetails", orderDetails);

  return (
    <Card>
      <CardHeader>Order History</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((order) => {
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-2 px-3 ${
                            order?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : order?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {order?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(order._id)}
                          >
                            View Details
                          </Button>
                          {openDetailsDialog && orderDetails && (
                            <ShopOrdersDetailsView
                              orderDetails={orderDetails}
                            />
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              : "No orders to show"}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;
