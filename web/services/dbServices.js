const config = require('../config/config');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: config.db_host,
    user: config.user,
    password: config.pass,
    database: config.db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

module.exports = pool;