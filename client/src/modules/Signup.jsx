import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function Signup() {
  const [registerStatus, setRegisterStatus] = useState('');
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      username: Yup.string().max(255).required('Required Username'),
      password: Yup.string().min(8).max(20).required('Required Password'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required Confirm Password'),
    }),

    onSubmit: async (values, {resetForm}) => {
      try {
        const response = await Axios.post('http://localhost:5000/admin/signup', {
          username: values.username,
          password: values.password,
        });

        setRegisterStatus(response.data.message);
        toast.success('Signup successful!', {
          position: 'top-right',
          autoClose: 3000, // Close the notification after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        // Log success message to the console
        console.log('Signup successful!');

        //reset form
        resetForm();
      } catch (error) {
        console.error('Error registering admin:', error);
        setRegisterStatus('Failed to register admin');
      }
    },
  });

  const handleLoginClick = () => {
    navigate('/admin')
  }
  const handleCloseClick = () => {
    navigate('/')
  }
  return (
    <div className='signup-main-wrap'>
      <div className='signup-form-container'>
          <button className='close-button' type="button" onClick={handleCloseClick}>
             <FontAwesomeIcon icon={faClose}/>
          </button>
      <div className='signup-header'>
      <h1>Sign Up</h1>
      <p>Signup as new admin</p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='input-group'>
        <div className='log-container'>
          <label htmlFor="username">Username</label>
          <input
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

        <div className='log-container'>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            required
            
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className='formik-statements'>{formik.errors.confirmPassword}</p>
          )}
        </div>
        </div>
        <button type="submit" className='btn-signup'>Register</button>
        <button type='button' onClick={handleLoginClick} className='btn-signup'>Login</button>
      </form>
      {registerStatus && <p>{registerStatus}</p>}
      <ToastContainer />
      </div>   
    </div>
  );
}

export default Signup;
