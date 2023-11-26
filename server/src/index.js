const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connection = require('../sql/db-connection.jsx'); 
const { insertEmployeeQuery } = require('../sql/db-query.jsx');
const { userLogin, userSignup } = require('../services/auth/authController.jsx')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}

//Sessions
app.use(
  session({
    secret: 'somnium-asylum',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // Set the session duration (24 hours in this case)
    },
  })
);



// Routes
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Route for user login
app.post('/admin/login', userLogin);

// Route for user signup
app.post('/admin/signup', userSignup);

// Route for fetching all departments
app.get('/departments', (req, res) => {
  const query = 'SELECT * FROM departments'; // Your SQL query
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Route for fetching all designations
app.get('/designations', (req, res) => {
  const query = 'SELECT * FROM designations'; // Your SQL query
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Route to add an employee to the database
app.post('/employees', (req, res) => {
  const { firstName, lastName, email, departmentId, designationId, joinDate } = req.body;
  connection.query(
    insertEmployeeQuery,
    [firstName, lastName, email, departmentId, designationId, joinDate],
    (err, result) => {
      if (err) {
        console.error('Error adding employee', err);
        res.status(500).send('Error adding employee');
      } else {
        console.log('Employee added successfully');
        res.send('Employee added successfully');
      }
    }
  );
});

// Route to fetch employees with optional search term
app.get("/employees", (req, res) => {
  const searchTerm = req.query.search || ""; // Get the search term from the query parameters
  const query = `
    SELECT * FROM employees
    WHERE CONCAT(first_name, ' ', last_name) LIKE ?;`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Route to fetch all departments
app.get("/departments", (req, res) => {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Route to fetch all designations
app.get("/designations", (req, res) => {
  const query = "SELECT * FROM designations";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Route for the table display
app.get('/employeetable',  (req, res) => {
  const query = `
    SELECT 
      e.id,
      e.first_name,
      e.last_name,
      e.email,
      d.name AS department,
      des.title AS designation,
      e.join_date
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN designations des ON e.designation_id = des.id;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees with details', err);
      res.status(500).send('Error fetching employees with details');
    } else {
      res.send(results);
    }
  });
});

// Route to delete an employee by ID
app.delete('/employees/:id',  (req, res) => {
  const employeeId = req.params.id;
  const query = 'DELETE FROM employees WHERE id = ?';

  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee', err);
      res.status(500).send('Error deleting employee');
    } else {
      console.log('Employee deleted successfully');
      res.send('Employee deleted successfully');
    }
  });
});

// Route to fetch a single employee by ID
app.get('/employees/:id',  (req, res) => {
  const employeeId = req.params.id;
  const query = 'SELECT * FROM employees WHERE id = ?';

  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error fetching employee details', err);
      res.status(500).send('Error fetching employee details');
    } else {
      res.send(result[0]);
    }
  });
});

app.get('/view-employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = `
    SELECT 
      e.id AS employeeId,
      CONCAT(e.first_name, ' ', e.last_name) AS name,
      d.name AS department,
      des.title AS designation
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN designations des ON e.designation_id = des.id
    WHERE e.id = ?;
  `;

  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error fetching employee details', err);
      res.status(500).send('Error fetching employee details');
    } else {
      res.send(result[0]);
    }
  });
});

//Route to update an employee
app.put('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const { firstName, lastName, email, departmentId, designationId, joinDate } = req.body;

  const query = `
    UPDATE employees
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      department_id = ?,
      designation_id = ?,
      join_date = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [firstName, lastName, email, departmentId, designationId, joinDate, employeeId],
    (err, result) => {
      if (err) {
        console.error('Error updating employee', err);
        res.status(500).send('Error updating employee');
      } else {
        console.log('Employee updated successfully');
        res.send('Employee updated successfully');
      }
    }
  );
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
  });
});
