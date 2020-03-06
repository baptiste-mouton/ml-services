let connection = require('../config/dbConfig');

class Service {

    static create(values,cb){
        connection.query('INSERT INTO Service SET ? ;',values, (err,rows) => {
            if(err) throw err
            cb(rows)
        })
    }

}

module.exports = Service;