import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUser } from '../services/api';
import './UserForm.css';

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'username') {
      if (!value) error = 'Username is required';
      else if (value.length < 3) error = 'Username must be at least 3 characters';
    }
    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
    }
    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form.',
      });
      return;
    }

    try {
      const userData = await createUser(formData);
      if (!userData || !userData.userId) {
        throw new Error('Invalid response from server: No user ID found');
      }
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: `Welcome, ${formData.username}! Please log in.`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to the server. Please ensure the backend is running on http://localhost:8081.';
      } else if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Email already exists.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
      });
      console.error('Registration error:', error.response || error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-header">Join Us</h2>
        <p className="signup-subtext">Create an account to start sharing your cooking skills!</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-field-wrapper">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`signup-field ${errors.username ? 'error' : ''}`}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div className="signup-field-wrapper">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`signup-field ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="signup-field-wrapper">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="new-password"
              className={`signup-field ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="signup-submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserForm;