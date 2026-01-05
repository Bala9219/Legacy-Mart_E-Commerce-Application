import { useContext, useEffect, useState } from "react";
import { UserContext } from "../services/UserContext";
import { getAddresses, addAddress, deleteAddress } from "../services/api";
import { useNavigate } from "react-router-dom";


const Profile = () => {

  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: ""
  });

  useEffect(() => {
    if (userId) loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
    try {
      const res = await getAddresses(userId);
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await addAddress(userId, form);

      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: ""
      });

      loadAddresses();
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      loadAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <div className="profile-page">

        <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
        </button>

      <h2 className="profile-title">My Profile</h2>
      <p className="profile-subtitle">
        Manage your saved delivery addresses
      </p>

      <h3>Saved Addresses</h3>

      {addresses.length === 0 && <p>No addresses saved yet.</p>}

      <div className="address-section">
        <div className="address-list">
            {addresses.map(a => (
                <div key={a.id} className="address-card">
                    <p className="address-name">{a.fullName} — {a.phone}</p>
                    <p className="address-row">{a.street}</p>
                    <p className="address-row">{a.city}, {a.state} — {a.postalCode}</p>
                    <button className="delete-btn"onClick={() => handleDelete(a.id)}>
                        Delete Address
                    </button>
                </div>
            ))}
        </div>
       </div>


      <h3>Add New Address</h3>

      <form onSubmit={handleAdd} className="address-form">
        <div className="form-grid">

          <input
            placeholder="Full Name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            required
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />

          <input
            placeholder="Street"
            value={form.street}
            onChange={e => setForm({ ...form, street: e.target.value })}
            required
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
            required
          />

          <input
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={e => setForm({ ...form, postalCode: e.target.value })}
            required
          />

          <button type="submit" className="save-btn">
            Save Address
          </button>

        </div>
      </form>
    </div>
  );
};

export default Profile;
