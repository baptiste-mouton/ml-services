let connection = require('../config/dbConfig');

class Utilisateur {

    static create(values, cb) {
        connection.query('INSERT INTO Utilisateur SET ? ;', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static all(cb) {
        connection.query('SELECT * FROM Utilisateur', (err, rows) => {
            if (err) throw err
            cb(rows)
        });
    };
    static findOne(attr, val, cb) {
        connection.query('SELECT * FROM Utilisateur WHERE ? = ?', [attr, val], (err, rows) => {
            if (err) throw err
            console.log(rows);
        });
    }
    static findByMail(values, cb) {
        connection.query('SELECT * FROM Utilisateur WHERE emailUser = ? LIMIT 1', values, (err, rows) => {
            if (err) throw err
            cb(rows);
        })
    }
    static getProfileInfos(values, cb) {
        connection.query('SELECT idUser, emailUser, nomUser, prenomUser, rue, codePostal, ville  FROM Utilisateur WHERE idUser = ? LIMIT 1', values, (err, rows) => {
            if (err) throw err
            cb(rows);
        })
    }

    static isAdmin(id, cb) {
        connection.query('SELECT estAdmin FROM Utilisateur WHERE idUser = ?', id, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    //FAIRE UNE FONCTION QUI REGROUPE TOUS LES UPDATES

    static updateNom(values, cb) {
        connection.query('UPDATE utilisateur SET nomUser = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updatePrenom(values, cb) {
        connection.query('UPDATE utilisateur SET prenomUser = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updateEmail(values, cb) {
        connection.query('UPDATE utilisateur SET emailUser = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updateAdresse(values, cb) {
        connection.query('UPDATE utilisateur SET rue = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updateVille(values, cb) {
        connection.query('UPDATE utilisateur SET ville = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updateCodePostal(values, cb) {
        connection.query('UPDATE utilisateur SET codePostal = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static updatePassword(values, cb) {
        connection.query('UPDATE utilisateur SET password = ? WHERE idUser = ?', values, (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

}

module.exports = Utilisateur;