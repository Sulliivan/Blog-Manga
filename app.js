const express = require('express')
,     app = express()
,     mysql = require('mysql')
,     util = require('util')
,     path = require('path')
,     port = 3000
,     fileUpload = require('express-fileupload')
,     connectFlash = require('connect-flash')
,     session = require('express-session')
,     methodOverride = require('method-override') // pouvoir transformer le nom des methodes dans Node

////////////////////////////////////////////////////////////

// Express-session  
// Mise en place du Cookie
app.use(session({
  secret: 'shhuuuuut',
  resave: false,
  saveUninitialized: true, 
  name: 'biscuit',
  cookie: {  maxAge: 24 * 60 * 60 * 7 * 1000}
}))
// Connect Flash
app.use(connectFlash())  // utilise zone flash pour stocker des messages et les retrenscrires

app.use(methodOverride('_method'))

app.use(fileUpload());
// .env
require('dotenv').config() // utiliser le fichier env qui est un fichier caché
// Middleware - Parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// EJS moteur de templating avec utilisation des fichier statique
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////////////////

// MySQL Connection à la base de donnée
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
////////////////////////////////////////////////////////////

// Controllers
const singleRouter = require ('./controller/singlePage'); // page d'un article
const pageRouter = require ('./controller/page'); // page principal
const dashboardRouter = require ('./controller/dashboard.js'); // page admin
const usersRouter = require ('./controller/users'); // page connection d'un user
const createRouter = require ('./controller/create'); // page d'inscription
const verifAuth = require('./middleware/auth.middleware');
const verifAuthAdmin = require ('./middleware/admin.middleware')

app.use (function (req, res, next){
  const userID = req.session.userId
  const userNAME = req.session.firstname
  const userROLES = req.session.roleId
// console.log(req.session.firstname,"firstname");
// console.log(req.session.userId,"user");
// console.log(req.session.roleId,"role");
 res.locals.usersession = {userID, userNAME, userROLES}
// console.log(res.locals.usersession);
  next()
})

// URL
app.use('/singlePage', singleRouter);
app.use('/page', pageRouter);
app.use('/dashboard', verifAuthAdmin, dashboardRouter);
app.use('/users', usersRouter);
app.use('/create', createRouter);
////////////////////////////////////////////////////////////

/////////////////////////////////////////////////
///////////////Login - Logout////////////////////

app.use('*', (req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
})


// 404
app.get('*', function(req, res, next){
  res.status(404);
  res.render('404.ejs');
});
 
////////////////////////////////////////////////////////////

// Listen
app.listen(port, () => {
  console.log(`Tourne sur le port : ${port}`);
});