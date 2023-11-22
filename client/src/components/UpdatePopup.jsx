import React, { useState } from 'react';
import '../styles/update-popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const UpdatePopup = ({ isOpen, onClose, onUpdate, employee, departments, designations }) => {
  const initialData = {
    firstName: employee ? employee.first_name : '',
    lastName: employee ? employee.last_name : '',
    email: employee ? employee.email : '',
    departmentId: employee ? employee.department_id : '',
    designationId: employee ? employee.designation_id : '',
    joinDate: employee ? employee.join_date : '',
  };

  const [updatedData, setUpdatedData] = useState(initialData);

  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData({
      ...updatedData,
      [name]: value
    });
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
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={updatedData.firstName}
            onChange={handleInputChange}
            placeholder={initialData.firstName}
            required
          />
          <br />

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={updatedData.lastName}
            onChange={handleInputChange}
            placeholder={initialData.lastName}
            required
          />
          <br />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
            placeholder={initialData.email}
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
            placeholder={initialData.joinDate}
            required
          />
          <br />

          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
        </form>
        </div>
      </div>
    )
  );
};

export default UpdatePopup;
