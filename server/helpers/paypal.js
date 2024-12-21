import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";

dotenv.config();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

export default paypal;
