import { useEffect, useState } from "react";
import { getOrderStatusHistory } from "../services/api";

export default function OrderTimeline({ orderId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getOrderStatusHistory(orderId);
        setHistory(res.data);
      } catch {
        setHistory([]);
      }
    };

    if (orderId) fetchHistory();
  }, [orderId]);

  if (!history.length) return <p>No status history available</p>;

  const formatDate = (d) => new Date(d).toLocaleString();

  const labels = {
    PLACED: "Order Placed",
    PAYMENT_PENDING: "Payment Pending",
    PAYMENT_FAILED: "Payment Failed",
    PAID: "Payment Successful",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const colors = {
    PLACED: "#f1c40f",
    PAYMENT_PENDING: "#ff9800",
    PAYMENT_FAILED: "#e74c3c",
    PAID: "#2ecc71",
    SHIPPED: "#3498db",
    DELIVERED: "#1abc9c",
    CANCELLED: "#7f8c8d",
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Order Timeline</h3>

      <div style={{ borderLeft: "3px solid #ccc", paddingLeft: 12 }}>
        {history.map((event, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors[event.status],
                marginLeft: -18,
              }}
            />
            <p style={{ margin: 0, fontWeight: "bold" }}>
              {labels[event.status] || event.status}
            </p>
            <span style={{ fontSize: 12, color: "gray" }}>
              {formatDate(event.changedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
