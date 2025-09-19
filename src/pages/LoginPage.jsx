import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../utils/AnimatedPage';
import { registerUser, loginUser } from '../services/api';

const LoginPage = ({ setUser }) => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', idCardNumber: '', password: '' });
  const [error, setError] = useState('');

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginUser(loginData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      // If profile is not complete, redirect to setup, otherwise to home
      if (!data.isProfileComplete) {
        navigate('/profile-setup');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await registerUser(signupData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/profile-setup');
    } catch (err) {
      if (err.response?.data?.message.includes('exists')) {
        setError('User with this email already exists. Please log in.');
        setActiveTab('login');
      } else {
        setError(err.response?.data?.message || 'An error occurred during signup.');
      }
    }
  };

  return (
    <AnimatedPage>
      <div className="login-page-wrapper">
        <div className="login-container">
          <div className="login-tabs">
            <div className={`login-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</div>
            <div className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</div>
          </div>

          <div className="form-container">
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleLoginSubmit} className={`form ${activeTab === 'login' ? 'active' : ''}`}>
              <h2>Welcome Back</h2>
              <div className="input-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" name="email" value={loginData.email} onChange={handleLoginChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" name="password" value={loginData.password} onChange={handleLoginChange} required />
              </div>
              <button type="submit">Login</button>
            </form>

            <form onSubmit={handleSignupSubmit} className={`form ${activeTab === 'signup' ? 'active' : ''}`}>
              <h2>Create Account</h2>
              <div className="input-group">
                <label htmlFor="signup-email">Email</label>
                <input type="email" id="signup-email" name="email" value={signupData.email} onChange={handleSignupChange} required />
              </div>
               <div className="input-group">
                <label htmlFor="idCardNumber">ID Card Number</label>
                <input type="text" id="idCardNumber" name="idCardNumber" value={signupData.idCardNumber} onChange={handleSignupChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="signup-password">Password</label>
                <input type="password" id="signup-password" name="password" value={signupData.password} onChange={handleSignupChange} required />
              </div>
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default LoginPage;