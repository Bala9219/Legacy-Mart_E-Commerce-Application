import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getCart } from '../services/api';
import { UserContext } from '../services/UserContext'

const ProductDetails = () => {
  const { id } = useParams();
  const { user, setUser, loadingUser } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const userId = user?.userId;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken'); 
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    fetchProduct();
    if (userId) fetchCart();
  }, [userId, id]);

  const fetchProduct = async () => {
    const res = await getProductById(id);
    setProduct(res.data);
  };

  const fetchCart = async () => {
    const res = await getCart(userId);
    setCart(res.data);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert('Please login to add items to cart');
      navigate('/login')
      return;
    }
    
    try {
      await addToCart(userId, product.id);
      alert('Added to cart successfully');
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot add more items');
    }
  };

  if (loadingUser || !product) return <p>Loading...</p>;

  const cartQty = cart
    ? Array.from(cart.items).find(i => i.product.id === product.id)?.quantity || 0 : 0;

  const disabled = product.stockQuantity === 0 || cartQty >= product.stockQuantity;

  return (
    <div>
      <header>
        <h1>Legacy Mart 🔱</h1>
        <div className="nav-right">
          <Link to="/cart">🛒 Cart</Link>

          {userId && (
            <div className="profile-wrapper">
              <div
                className="profile-icon"
                onClick = {() => setShowMenu(!showMenu)}
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
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="product-image-card">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/300'}
              alt={product.name}
            />
          </div>

          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>₹ {product.price}</h3>

            <button
              className="button"
              onClick={() => handleAddToCart(product)}
              disabled={disabled}
              style={{ opacity: disabled ? 0.5 : 1 }}
            >
              {!userId
                ? 'Login to Add'
                : product.stockQuantity === 0
                  ? 'Out of Stock'
                  : cartQty >= product.stockQuantity
                    ? 'Stock Limit Reached'
                    : 'Add to Cart'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
