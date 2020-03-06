let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let dotenv = require('dotenv');
let helmet = require('helmet');

const PORT = process.env.PORT || 8080;

dotenv.config();

app.set('view engine', 'ejs');

//MIDDLEWARES :
app.use(express.static(__dirname + "/public"));
app.use(helmet()); //secure headers
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//ROUTES : 
app.use('/', require('./routes/home'));
app.use('/user', require('./routes/user'));
app.use('/creneau',require('./routes/creneau'));
app.use('/services', require('./routes/home'));

//app.use('/auth',jwt.authentification,require('./routes/auth'));
//app.use('/auth/user', require('./models/User'));
//app.use('/auth/creneau', require('./models/Creneau'));


app.listen(PORT, () => console.log(`Server up, listenning on port ${PORT} !`));