import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import CheckoutPayment from "../components/CheckoutPayment";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch (err) {
      alert('Failed to load order details');
      console.error(err);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <header>
        <h1>Legacy Mart 🔱</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Back to Orders
        </button>
      </header>

      <div className="container">
        <h2>Order #{order.id}</h2>
        <p>Status: <b>{order.status}</b></p>
        <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : '--'}</p>

        <OrderTimeline orderId={order.id} />

        {order.deliveryAddress ? (
          <div className="address-card">
            <div className="address-header">
              <span className="address-icon">📍</span>
              <h3>Delivery Address</h3>
            </div>

            <div className="address-body">
              <p className="address-name">
                {order.deliveryAddress.fullName}
              </p>

              <p className="address-phone">
                📞 {order.deliveryAddress.phone}
              </p>

              <p className="address-text">
                {order.deliveryAddress.street}
              </p>

              <p className="address-text">
                {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.state}
                <span className="postal-code">
                  {" "}
                  - {order.deliveryAddress.postalCode}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p>No delivery address provided.</p>
        )}

        {order.items && order.items.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product?.name || '—'}</td>
                  <td>₹ {item.price?.toFixed(2) || '0.00'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>₹ {(item.price * item.quantity)?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in this order.</p>
        )}

        <h3 style={{ marginTop: '20px' }}>
          Grand Total: ₹ {order.totalAmount?.toFixed(2) || '0.00'}
        </h3>

        {(order.status === "PAYMENT_PENDING" || order.status === "PLACED" || order.status === "PAYMENT_FAILED") && (
          <CheckoutPayment orderId={order.id} amount={order.totalAmount} />
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
