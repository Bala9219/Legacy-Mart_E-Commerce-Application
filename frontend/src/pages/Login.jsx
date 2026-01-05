import React, { useState, useContext } from 'react';
import { login } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../services/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });
      console.log("Login response:", res.data);

      const { token, userId, email: userEmail, role } = res.data;

      const userData = { userId, email: userEmail, role, token };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("jwtToken", token);

      setUser(userData);

      if(role === "ADMIN"){
        navigate("/admin/orders");
      }else{
        navigate("/");
      }
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="auth-checkbox">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
