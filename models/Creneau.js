let connection = require('../config/dbConfig');

class Creneau {
    
    static all(cb) {
        connection.query('SELECT * FROM Creneau', (err,rows) => {
            if(err) throw err
            cb(rows)
        });
    };
}

module.exports = Creneau;