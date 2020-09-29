const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql1977Mysql00!',
  database: 'quotes'
});

module.exports = connection;
