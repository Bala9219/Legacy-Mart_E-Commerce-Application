import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await getUserOrders(userId);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;

  return (
    <div>
      <header>
        <h1>Legacy Mart 🔱</h1>
        <div className="nav-right">
          <Link to="/">🏠 Home</Link>

          <div className="profile-wrapper">
            <div
              className="profile-icon"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            {showMenu && (
              <div className="profile-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}
                  style={{ borderBottom: '1px solid #ccc', cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td>{order.id}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "--"}
                  </td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status || "N/A"}
                    </span>
                  </td>
                  <td>₹ {order.totalAmount.toFixed(2)}</td>

                  <td>{order.items?.length || 0}</td>

                  <td>
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.fullName}, ${order.deliveryAddress.city}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
