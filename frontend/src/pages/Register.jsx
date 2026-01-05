import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!agree) {
      setError('Please agree to the terms');
      return;
    }

    try {
      await register({ email, password });
      alert('Registered successfully');
      navigate('/login');
    } catch {
      setError('E-Mail already exists');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <div className="auth-checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={e => {
              setAgree(e.target.checked);
              setError('');
            }}
          />
          <label>I agree to the terms</label>
        </div>

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>
            {error}
          </p>
        )}

        <button className="button" onClick={handleRegister}>
          Register
        </button>

        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
