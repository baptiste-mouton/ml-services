let connection = require('../config/dbConfig');

class Creneau {

    static all(cb) {
        connection.query('SELECT * FROM Creneau', (err, rows) => {
            if (err) throw err
            cb(rows)
        });
    };

    static datesSemaineActuelle() {
        var today = new Date();
        var cpt = today.getDay();
        var res = [];
        for (var i = 0; i < (14 - cpt); i++) {
            res.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
        }
        return res; //res contient les jours restants de la semaine actuelle
    }

    static getCreneauxByDay(date,cb){
        connection.query('SELECT Creneau_idCreneau FROM Intervention WHERE dateIntervention = ?',date, (err,rows) => {
            if(err) throw err
            cb(rows)
        });
    }

    static StringFromId(creneauId){
        let res = "";
        switch(creneauId){
        case 1 : res = '08:00 - 09:00'; break;
        case 2 : res = '09:00 - 10:00'; break;
        case 3 : res = '10:00 - 11:00'; break;
        case 4 : res = '11:00 - 12:00'; break;
        case 5 : res = '12:00 - 13:00'; break;
        case 6 : res = '13:00 - 14:00'; break;
        case 7 : res = '14:00 - 15:00'; break;
        case 8 : res = '15:00 - 16:00'; break;
        case 9 : res = '16:00 - 17:00'; break;
        case 10 : res = '17:00 - 18:00'; break;
        }
        return res;
    }

}

module.exports = Creneau;