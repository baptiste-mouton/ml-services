let connection = require('../config/dbConfig');

class Intervention {

    static create(values,cb){
        connection.query('INSERT INTO Intervention SET ? ;',values, (err,rows) => {
            if(err) throw err
            cb(rows)
        })
    }

    static getInterToComeByClient(userId,cb){
        connection.query('SELECT * FROM Intervention WHERE Utilisateur_idUser = ? AND dateIntervention >= CURRENT_DATE',userId, (err,rows) => {
            if(err) throw err
            cb(rows)
        })
    }

}
module.exports = Intervention;