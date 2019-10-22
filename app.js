const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash')

require('dotenv').config()
require('./config/passport')(passport);

// app requirements
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(flash());

app.use(session({
    secret: process.env.SEEK,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// flash vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(passport.initialize());
app.use(passport.session());

const { dbConnection, db, options } = require('./utils/database-utils');

mongoose.connect(db, options, (err) => dbConnection(err));

const PORT = process.env.PORT || 5000;

// routes
const elizaRoute = require('./routes/elizaRoute');
const authRoute = require('./routes/authRoute');

app.use('/', authRoute);
app.use('/dashboard', elizaRoute);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));