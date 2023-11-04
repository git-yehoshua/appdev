const mysql = require ('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'JIOS777',
  database: 'employeeDB',
});


module.exports = connection;
