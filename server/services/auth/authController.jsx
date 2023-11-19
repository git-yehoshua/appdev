const connection = require('../../sql/db-connection.jsx');
const bcrypt = require('bcrypt');

const userLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT * FROM userAdmin WHERE username = ?', username, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send({ error: 'Internal Server Error' });
    }

    if (result && result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (error) {
          console.error('Error comparing passwords:', error);
          return res.status(500).send({ error: 'Internal Server Error' });
        }

        if (response) {
          // Send necessary information to the client
          const { id, username, is_admin } = result[0];
          // Set session variable
          req.session.user = { id, username, is_admin };
          res.send({ id, username, is_admin });
        } else {
          res.status(401).send({ message: 'Wrong email or password combination!' });
        }
      });
    } else {
      res.status(404).send({ message: "Account doesn't exist" });
    }
  });
};




const userSignup = (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (hashError, hashedPassword) => {
    if (hashError) {
      // Handle hashing error
      console.error('Error hashing password:', hashError);
      return res.status(500).send({ error: 'Error hashing password' });
    }

    const newUser = {
      username: username,
      password: hashedPassword,
      is_admin: true, // set new users as admins
    };

    connection.query('INSERT INTO userAdmin SET ?', newUser, (dbError, results) => {
      if (dbError) {
        // Handle database error
        console.error('Error inserting user into database:', dbError);
        return res.status(500).send({ error: 'Error inserting user into database' });
      }

      // Only send necessary information to the client
      const { insertId, username, is_admin } = newUser;
      res.status(201).send({ userId: insertId, username, is_admin });
    });
  });
};


module.exports = {
  userLogin,
  userSignup,
};
