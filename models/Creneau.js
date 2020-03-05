let connection = require('../config/dbConfig');

class Creneau {

    static all(cb) {
        connection.query('SELECT * FROM Creneau', (err, rows) => {
            if (err) throw err
            cb(rows)
        });
    };

    static datesSemaineActuelle() {
        var today = new Date(2020, 1, 29);
        var cpt = today.getDay();
        console.log(cpt);
        var res = [];
        for (var i = 0; i <= (7 - cpt); i++) {
            res.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
        }
        return res; //res contient les jours restants de la semaine actuelle
    }


}


module.exports = Creneau;