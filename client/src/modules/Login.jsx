import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authContext';
import '../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await Axios.get('http://localhost:5000/check-auth', { withCredentials: true });

        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthStatus();
  }, [setIsLoggedIn, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required Username'),
      password: Yup.string().required('Required Password'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await Axios.post(
          'http://localhost:5000/admin/login',
          {
            username: values.username,
            password: values.password,
          },
          { withCredentials: true }
        );

        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setIsLoggedIn(true);
          
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginStatus('Failed to log in');
      }
    },
  });

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      // Redirect to the admin page or any other page on successful login
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  const handleSignUpClick = () => {
    // Navigate to the signup page
    navigate('/signup');
  };

  const handleCloseClick = () => {
    navigate('/')
  }

  return (
    <div className='login-main-wrap'>
      <div className='login-form-container'>
          <button className='close-button' type="button" onClick={handleCloseClick}>
             <FontAwesomeIcon icon={faClose}/>
          </button>
      <div className='login-header'>
      <h1>Login</h1>
      <p>You must be an admin to access employee information.</p>
      </div>
      <form onSubmit={formik.handleSubmit}>
          <div className='input-group'>
          <div className='log-container'>
            <label htmlFor="username">Username</label>
            <input
              id='username'
              name="username"
              type="text"
              placeholder="Enter username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              required
              
            />
            {formik.touched.username && formik.errors.username && (
              <p className='formik-statements'>{formik.errors.username}</p>
            )}
          </div>

          <div className='log-container'>
            <label htmlFor="password">Password</label>
            <input
              id='password'
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className='formik-statements'>{formik.errors.password}</p>
            )}
          </div>
         </div>
        <button type="submit" className='btn-login'>Login</button>
        <button type="button" className='btn-login' onClick={handleSignUpClick}>Sign up</button>
      </form>
      </div>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
};

export default Login;
