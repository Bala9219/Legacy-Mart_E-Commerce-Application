import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div>
      <header>
        <h1>Legacy Mart 🔱</h1>
      </header>

      <div className="container order-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>

        <div className="order-actions">
          <Link to="/" className="button">
            Continue Shopping
          </Link>

          <Link to="/orders" className="button">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
