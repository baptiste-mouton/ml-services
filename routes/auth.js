let express = require('express');
let router = express.Router();
let app = express();
let user = require('./user');

router.redirect('/user')

module.exports = router;