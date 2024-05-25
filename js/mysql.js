const mysql = require('mysql');

class MySQL {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'mangho_user',
      password: '123321',
      database: 'manghodb'
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MariaDB:', err.stack);
          reject(err);
          return;
        }
        console.log('Connected to MariaDB as id', this.connection.threadId);
        resolve();
      });
    });
  }

  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error.stack);
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          console.error('Error ending connection to MariaDB:', err.stack);
          reject(err);
          return;
        }
        console.log('Connection to MariaDB closed.');
        resolve();
      });
    });
  }
}

module.exports = MySQL;
