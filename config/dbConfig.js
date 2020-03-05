let mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "baptisteMoutonsql08",
    database: "projetAuxVie",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if(!err){
        console.log('Connected to database !')
    }else{
        console.log('Unable to connect to the database...')
    }
});

module.exports = mysqlConnection;