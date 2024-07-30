const mysql2 = require('mysql2');

const connection = mysql2.createPool({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: '123kote45',
    database: 'mydatabase'
}).promise();
module.exports = connection;