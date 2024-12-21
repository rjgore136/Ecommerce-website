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

import AdminOrdersDetailsView from "./order-details";

const Orders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    return () => {
      console.log(openDetailsDialog);
    };
  }, [openDetailsDialog]);

  function fix() {
    console.log("Working...");
    setOpenDetailsDialog(true);
  }

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
            <TableRow>
              <TableCell>123</TableCell>
              <TableCell>9/11/2024</TableCell>
              <TableCell>In process</TableCell>
              <TableCell>₹3000</TableCell>
              <TableCell>
                <Dialog
                // open={openDetailsDialog}
                // onOpenChange={() => {
                //   setOpenDetailsDialog(false);
                // }}
                >
                  <DialogTrigger>
                    <Button>View Details</Button>
                  </DialogTrigger>
                  <AdminOrdersDetailsView />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Orders;
