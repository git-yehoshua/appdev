import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authContext';

const Login = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

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
          // Redirect to the admin page or any other page on successful login
          navigate('/admin');
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

  return (
    <div>
      <h1>User Login</h1>
      <form onSubmit={formik.handleSubmit}>
         <div>
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
            <p>{formik.errors.username}</p>
          )}
        </div>

        <div>
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
            <p>{formik.errors.password}</p>
          )}
        </div>
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignUpClick}>Sign up</button>
      </form>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
};

export default Login;
