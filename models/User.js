let connection = require('../config/dbConfig');

class Utilisateur {

    static create(values,cb){
        connection.query('INSERT INTO Utilisateur SET ? ;',values, (err,rows) => {
            if(err) throw err
            cb(rows)
        })
    }
    static all(cb) {
        connection.query('SELECT * FROM Utilisateur', (err,rows) => {
            if(err) throw err
            cb(rows)
        });
    };
    static findOne(attr,val,cb){
        connection.query('SELECT * FROM Utilisateur WHERE ? = ?', [attr,val], (err,rows) => {
            if(err) throw err
            console.log(rows);
        });
    }
    static findByMail(values,cb){
        connection.query('SELECT * FROM Utilisateur WHERE emailUser = ? LIMIT 1', values, (err,rows) => {
            if(err) throw err
            cb(rows);
        })
    }
    static getProfileInfos(values,cb){
        connection.query('SELECT idUser, emailUser, nomUser, prenomUser FROM Utilisateur WHERE idUser = ? LIMIT 1',values, (err,rows) => {
            if(err) throw err
            cb(rows);
        })
    }
}

module.exports = Utilisateur;