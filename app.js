const express = require('express')
,     app = express()
,     mysql = require('mysql')
,     util = require('util')
,     path = require('path')
,     port = 3000
const fileUpload = require('express-fileupload');
app.use(fileUpload());


// .env
require('dotenv').config()

// Middleware - Parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// MySQL
const db =  mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });

db.connect((err) => {
    if (err) { throw err;}
    console.log('Connecté au serveur MySQL');
});

const query = util.promisify(db.query).bind(db);
global.query = query;

// Router
// const singleRouter = require ('./routes/singlePage');
// const pageRouter = require ('./routes/page');
// const dashboardRouter = require ('./routes/dashboard.js');

// const registRouter = require ('./routes/auth');
// const resetPassword = require('./routes/reset-password')

// URL
// app.use('/singlePage', singleRouter);
// app.use('/page', pageRouter);
// app.use('/dashboard', dashboardRouter);

// app.use('/auth', registRouter);
// app.use('/reset-password', resetPassword);

// 404
app.get('*', function(req, res, next){
  res.status(404);
  res.render('404.ejs');
});
 
// Listen
app.listen(port, () => {
  console.log(`Tourne sur le port : ${port}`);
});