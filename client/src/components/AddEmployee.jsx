import React from 'react';
import '../styles/add-popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faSave } from '@fortawesome/free-solid-svg-icons';

const AddEmployee = ({ isOpen, onClose, formData, departments, designations, handleInputChange, handleSubmit }) => {
  return (
    isOpen && (
        <div className='add-popup'>
        <div className='add-popup-inner'>
        <h3>Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className='name-input-wrap'>
          <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          </div>
          
          <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          </div>
          </div>
          
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
          <div className='submit-button'>
          <button type="submit">Submit 
          <FontAwesomeIcon icon={faCheck}/></button>
          </div>
          <button className='close-button' type="button" onClick={onClose}>
              <FontAwesomeIcon icon={faClose}/>
            </button>
        </form>
        </div>
      </div>
    )
  );
}

export default AddEmployee