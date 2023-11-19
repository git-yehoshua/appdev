import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/employeeSearch.css";

const EmployeeSearch = ({ setSelectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employees?search=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    // Fetch data only if the searchTerm is not empty
    if (searchTerm.trim() !== "") {
      fetchEmployeeData();
    } else {
      // Clear results if searchTerm is empty
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="search-container">
      <div className="searchBar">
        <input
        className="search-input"
          type="text"
          placeholder="Search Employee"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="search-results">
        {searchResults.map((employee) => (
          <li key={employee.id}
              className="result-item"
              onClick={() => handleSelectEmployee(employee)}>
            {`${employee.first_name} ${employee.last_name}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSearch;
