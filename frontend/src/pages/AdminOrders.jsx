import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../services/api';

console.log("USER:", JSON.parse(localStorage.getItem("user")));

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.data);
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <header>
        <h1>Admin – Orders</h1>

        {userId && (
          <div className="profile-wrapper">
            <div
              className="profile-icon"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            {showMenu && (
              <div className="profile-menu">
                <button onClick={() => navigate('/admin/products')}>
                    Update Products
                  </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>${order.totalAmount}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="PAID">PAID</option>
                    <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                    <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
                  </select>
                </td>

                <td>{new Date(order.createdAt).toLocaleString()}</td>

                <td>
                  <Link to={`/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
