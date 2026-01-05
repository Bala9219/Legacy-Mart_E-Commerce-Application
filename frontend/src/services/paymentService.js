import { api as axios } from "./api"; 

const PAYMENT_BASE_URL = "/payments";

export const createPaymentIntent = async (orderId) => {
  const res = await axios.post(`${PAYMENT_BASE_URL}/create/${orderId}`);
  return res.data;
};

export const markPaymentSuccess = async (paymentIntentId) => {
  const res = await axios.post(
    `${PAYMENT_BASE_URL}/success?paymentIntentId=${paymentIntentId}`
  );
  return res.data;
};
