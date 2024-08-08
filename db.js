const mysql2 = require('mysql2');

const connection = mysql2.createPool({
    host: 'localhost',
    port: 3308, 
    user: 'sweety',
    password: 'sweety',
    database: 'vtspayroll'
}).promise();
module.exports = connection;