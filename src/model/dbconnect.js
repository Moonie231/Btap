const mysql = require ('mysql');

let connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Student'
})

module.exports = connect