import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/employeeSearch.css";

const EmployeeSearch = ({ setSearch, setSelectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchResults && searchResults.length > 0) {
      const results = searchResults.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search Employee"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      <ul>
        {searchResults.map((employee) => (
          <li key={employee.id} onClick={() => handleSelectEmployee(employee)}>
            {`${employee.first_name} ${employee.last_name}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSearch;
