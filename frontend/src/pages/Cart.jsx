import React, { useEffect, useState } from 'react';
import { getCart, increaseQuantity, decreaseQuantity, removeItem, placeOrder, getAddresses } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addressError, setAddressError] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    const res = await getCart(userId);
    setCart(res.data);
  };

  useEffect(() => {
  if (userId) loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
  const res = await getAddresses(userId);
  setAddresses(res.data);
  };

  const handleIncrease = async (item) => {
    if (item.quantity >= item.product.stockQuantity) {
      alert('Cannot add more than available stock');
      return;
    }
    try {
      await increaseQuantity(userId, item.id);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Cannot add more items');
    }
  };

  const handleDecrease = async (id) => {
    await decreaseQuantity(userId, id);
    fetchCart();
  };

  const handleRemove = async (id) => {
    await removeItem(userId, id);
    fetchCart();
  };

  const handlePlaceOrder = async () => {
    if(!selectedAddress){
      setAddressError("Please select a delivery address before placing order");
      return;
    }
    try {
      await placeOrder({
        userId: userId,
        addressId: selectedAddress
      });
      alert('Order placed successfully!');
      navigate('/order-success');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    }
  };

  if (!cart) return <p>Loading...</p>;

  const items = Array.from(cart?.items || []);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div>
      <header>
        <h1>Legacy Mart 🔱</h1>
        <div className="nav-right">
          <Link to="/">🏠 Home</Link>

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
                  <button onClick={() => navigate('/profile')}>
                    My Profile
                  </button>
                  <button onClick={() => navigate('/orders')}>
                    View Orders
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container">
        <h2>Your Cart</h2>

        {items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td>{item.product.name}</td>
                  <td>₹ {item.product.price}</td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button className="button" onClick={() => handleDecrease(item.id)}>-</button>
                      <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                      <button
                        className="button"
                        onClick={() => handleIncrease(item)}
                        disabled={item.quantity >= item.product.stockQuantity}
                        style={{ opacity: item.quantity >= item.product.stockQuantity ? 0.5 : 1 }}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>₹ {(item.product.price * item.quantity).toFixed(2)}</td>

                  <td>
                    <button className="button" onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                <td colSpan="2" style={{ fontWeight: 'bold' }}>
                  ₹ {total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {items.length > 0 && (
          <div style={{ marginTop: '25px' }}>
            <h3>Select Delivery Address</h3>

            {addresses.length ===0 ? (
              <p>No saved addresses found.</p>
            ) : (
              <div>
                {addresses.map(addr => (
                  <label
                    key={addr.id}
                    style={{
                      display: "block",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      cursor: "pointer"
                    }}
                  >
                    <input 
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => { 
                        setSelectedAddress(addr.id);
                        setAddressError("");
                      }}
                      style={{ marginRight: "10px" }}
                    />

                    <strong>{addr.fullName}</strong> — {addr.phone} <br />
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </label>
                ))}
              </div>
            )}
            {addressError && (
              <p style={{ color: "red", marginTop: "5px" }}>
                {addressError}
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          <button
            className="button"
            style={{ marginTop: '20px' }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
