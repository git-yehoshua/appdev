import React, { useState, useEffect } from 'react';
import '../styles/update-popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const UpdatePopup = ({ isOpen, onClose, onUpdate, employee, departments, designations }) => {
  const [updatedData, setUpdatedData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    designationId: '',
    joinDate: '',
  });

  useEffect(() => {
    if (employee) {
      setUpdatedData({
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        departmentId: employee.department_id,
        designationId: employee.designation_id,
        joinDate: formatDateForInput(employee.join_date),
      });
    }
  }, [employee]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData({
      ...updatedData,
      [name]: value
    });
  };

  const formatDateForInput = (dateString) => {
    const formattedDate = new Date(dateString).toISOString().split('T')[0];
    return formattedDate;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate(updatedData);
  };

  return (
    isOpen && (
      <div className='update-popup'>
        <div className='popup-inner'>
        <h3>Update Employee</h3>
        <form onSubmit={handleSubmit}>
          
         <div className='update-input-wrap'>
          <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={updatedData.firstName}
            onChange={handleInputChange}
            required
          />
          </div>
          <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={updatedData.lastName}
            onChange={handleInputChange}
            required
          />
          </div>
         </div>

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
            required
          />
          <br />

          <label>Department:</label>
          <select
            name="departmentId"
            value={updatedData.departmentId}
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
            value={updatedData.designationId}
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
            value={updatedData.joinDate}
            onChange={handleInputChange}
            required
          />
          <br />

          <div className='save-changes'>
          <button type="submit">Save Changes</button>
          </div>
          <button className='close-button' type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
        </form>
        </div>
      </div>
    )
  );
};

export default UpdatePopup;
