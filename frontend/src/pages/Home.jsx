import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../services/UserContext';
import { getProducts, getCategories, addToCart, getCart } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const userId = user?.userId;
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken'); 
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    if(userId) fetchCart();
  }, [userId]);

  const fetchProducts = async (searchTerm = '', categoryId = '') => {
    const res = await getProducts(searchTerm || undefined, categoryId || undefined);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const fetchCart = async () => {
    if (!userId) return;
    const res = await getCart(userId);
    setCart(res.data);
  };

  const getCartQty = (productId) => {
    if (!cart) return 0;
    const item = Array.from(cart.items).find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const debouncedFetch = debounce((searchTerm, categoryId) => {
    fetchProducts(searchTerm, categoryId);
  }, 300);

  const handleAddToCart = async (product) => {
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedFetch(e.target.value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchProducts(search, e.target.value);
  };

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
        <div className="filter-bar">
          <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="category-box">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {products.map(product => {
            const cartQty = getCartQty(product.id);
            const disabled =
              isAdmin ||
              product.stockQuantity === 0 ||
              cartQty >= product.stockQuantity;

            return (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/200'}
                    className="product-image"
                    alt={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>₹ {product.price}</p>
                </Link>

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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
