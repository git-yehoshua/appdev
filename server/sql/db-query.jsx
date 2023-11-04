
const insertEmployeeQuery = `
  INSERT INTO employees (first_name, last_name, email, department_id, designation_id, join_date)
  VALUES (?, ?, ?, ?, ?, ?)
`;

module.exports = {
  insertEmployeeQuery,
};
