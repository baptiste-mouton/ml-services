let express = require('express');
let app = express();
let bodyParser = require('body-parser');
//let mysqlConnection = require('./config/dbConfig');

const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');

//MIDDLEWARES :
app.use(express.static(__dirname + "/public"));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//ROUTES : 
app.use('/', require('./routes/home'));

app.use('/user', require('./routes/user'));


app.listen(PORT, () => console.log(`Server up, listenning on port ${PORT} !`));