const mysql2 = require('mysql2');

const connection = mysql2.createPool({
    host: '127.0.0.1',
    port: 3308, 
    user: 'sweety',
    password: 'sweety',
    database: 'vtspayroll'
}).promise();
module.exports = connection;