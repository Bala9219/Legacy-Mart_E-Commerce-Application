import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ id: null, name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || ''
    });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')){
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
      imageUrl: form.imageUrl,
      category: { id: parseInt(form.categoryId) }
    };

    if(form.id){
      await updateProduct(form.id, payload);
      setMessage('Product updated successfully ✅');
    } else {
      await createProduct(payload);
      setMessage('Product added successfully ✅');
    }

    setForm({ id: null, name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
    fetchProducts();
  };

  return (
    <div>
      <header>
        <h1>Admin – Products</h1>
        <Link to="/admin/orders">⬅ Back to Orders</Link>
      </header>

      <div className="container">
        <h2>{form.id ? 'Edit Product' : 'Add Product'}</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <form 
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }} 
          onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        >
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input type="number" placeholder="Stock Quantity" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})} />
          <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="button" type="submit">{form.id ? 'Update' : 'Add'}</button>
            {form.id && <button type="button" onClick={() => setForm({ id: null, name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' })}>Cancel</button>}
          </div>
        </form>

        <h2 style={{ marginTop: '30px' }}>Products List</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>${p.price}</td>
                <td>{p.stockQuantity}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
