import "../styles/employeeSearch.css";

import React, { useState } from "react";

const employeeData = [
  { id: 1, name: "Joshua Flores", department: "IT", designation: "Manager" },
  { id: 2, name: "Juan Dela Cruise", department: "Finance", designation: "Analyst" },
  { id: 3, name: "Mary Ann Santos", department: "IT", designation: "Developer" },
  
];

const EmployeeSearch = ({ setSearch, setSelectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchTerm) => {
    const results = employeeData.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
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
            {employee.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSearch;
