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

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

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

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios
        .delete(`http://localhost:5000/employees/${employeeId}`)
        .then((response) => {
          console.log('Employee deleted successfully', response.data);
          toast.success('Employee deleted successfully', {
            position: toast.POSITION.TOP_CENTER
          });
          // Refresh the employee list after deleting an employee
          fetchEmployees();
        })
        .catch((error) => {
          console.error('Error deleting employee', error);
        });
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    // Open your update pop-up component here
    // You can use a modal or any other UI component for updating employee information
  };

  const handleLogout = () => {
    // Perform logout logic, such as clearing session, etc.
    // After logout, update the isLoggedIn state to false.
    setIsLoggedIn(false);
    // Redirect to the login page or any other desired route.
    navigate("/login");
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

        <button type='button' onClick={handleLogout}>Logout</button>
      </form>

      <div>
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Join Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{`${employee.first_name} ${employee.last_name}`}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td>{employee.join_date}</td>
              <td>
                <button onClick={() => handleUpdate(employee)}>Update</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
    </div>
  );
};

export default Admin;
