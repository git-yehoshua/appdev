import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdatePopup from '../components/UpdatePopup';
import { useAuth } from '../components/authContext';
import '../styles/admin.css';
import AddEmployee from '../components/AddEmployee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faPlus } from '@fortawesome/free-solid-svg-icons';

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
  const [isUpdatePopupOpen, setUpdatePopupOpen] = useState(false);
  const [isAddPopupOpen, setAddPopupOpen] = useState(true);
  const {isLoggedIn, setIsLoggedIn} = useAuth();


  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
    fetchEmployeesTable();
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
      throw error;
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/designations');
      setDesignations(response.data);
    } catch (error) {
      console.error('Error fetching designations', error);
      throw error;
    }
  };

  const fetchEmployeesTable = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employeetable');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees with details', error);
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
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          pauseOnHover: false
        });

        fetchEmployeesTable();
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
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
            pauseOnHover: false
          });
          // Fetch departments and designations before updating the employee list
          Promise.all([fetchDepartments(), fetchDesignations()])
            .then(() => fetchEmployeesTable())
            .catch((error) => {
              console.error('Error fetching departments or designations', error);
            });
        })
        .catch((error) => {
          console.error('Error deleting employee', error);
        });
    }
  };  

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setUpdatePopupOpen(true);
  };
  

  const handleUpdatePopupClose = () => {
    setUpdatePopupOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployeeOpen = () => {
    setAddPopupOpen(true);
  };

  const handleAddEmployeeClose = () => {
    setAddPopupOpen(false);
  };

  const handleUpdateSubmit = (updatedData) => {
    // Make an API request to update the employee data on the server
    axios.put(`http://localhost:5000/employees/${selectedEmployee.id}`, updatedData)
      .then((response) => {
        console.log('Employee updated successfully', response.data);
        toast.success('Employee updated successfully', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          pauseOnHover: false
        });
        // Refresh the employee list after updating an employee
        fetchEmployees();
        fetchEmployeesTable();
      })
      .catch((error) => {
        console.error('Error updating employee', error);
      });
  
    // Close the update popup after updating
    handleUpdatePopupClose();
  };


  const handleLogout = () => {
    // Add your logout logic here
    // For example, you might want to clear the session and redirect to the login page
    axios.post('http://localhost:5000/logout') // Assuming you have a logout endpoint
      .then((response) => {
        console.log('User logged out successfully', response.data);
        setIsLoggedIn(false);
        
      })
      .catch((error) => {
        console.error('Error logging out', error);
      });
  };
  
  

  return (
    <div className='admin-main-wrap'>
       <div className='header-wrap'>
        <h2>Employee List</h2>
        <button onClick={handleAddEmployeeOpen}>Add employee
          <FontAwesomeIcon icon={faPlus}/>
        </button>
       </div>
      {isAddPopupOpen && (
        <AddEmployee
        isOpen={isAddPopupOpen}
        onClose={handleAddEmployeeClose} 
        formData={formData}
        departments={departments}
        designations={designations}
        handleInputChange={handleInputChange}
        handleSubmit = {handleSubmit}
        handleLogout={handleLogout}
        />
      )}
      
      <div className='employee-table-wrap'>
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
                <button className='delete-button' onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <UpdatePopup
        isOpen={isUpdatePopupOpen}
        onClose={handleUpdatePopupClose}
        onUpdate={handleUpdateSubmit}
        employee={selectedEmployee}
        departments={departments}
        designations={designations}
      />
      <div className='logout-button-wrap'>
        <button type='button' onClick={handleLogout}>Logout
        <FontAwesomeIcon icon={faDoorClosed}/></button>
      </div>
    </div>
  );
};

export default Admin;
