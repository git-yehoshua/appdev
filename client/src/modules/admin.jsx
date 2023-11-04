import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    designationId: '',
    joinDate: ''
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments', error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/designations');
      setDesignations(response.data);
    } catch (error) {
      console.error('Error fetching designations', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:5000/employees', formData)
      .then((response) => {
        console.log('Employee added successfully', response.data);
        toast.success('Employee added successfully', {
          position: toast.POSITION.TOP_CENTER
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          departmentId: '',
          designationId: '',
          joinDate: ''
        });
      })
      .catch((error) => {
        console.error('Error adding employee', error);
      });
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Department:</label>
        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <br />
        <label>Designation:</label>
        <select
          name="designationId"
          value={formData.designationId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Designation</option>
          {designations.map((designation) => (
            <option key={designation.id} value={designation.id}>
              {designation.title}
            </option>
          ))}
        </select>
        <br />
        <label>Join Date:</label>
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleInputChange}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Admin;
