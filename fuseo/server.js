const express = require('express');
const router = require('./routing');
const session = require('express-session');
const contextMiddleware = require('./context')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const serveStaticIfExists = require('./serveStatic')
const app = express();

//Set Port

const port = (process.argv[2] ? process.argv[2] : 80 );

//Setup Multer for file uploads

const multer =  require('multer') ;
const upload = multer();

//Setup urlencoded and json parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Setup Sessions
const store = new SequelizeStore({
    db: global.db,
})

store.sync();
app.use(session({
  secret: 'your-secret-key',            // Change this to a strong secret for your app
  resave: false,                        // Don't save session if unmodified
  saveUninitialized: false,             // Don't create session until something stored
  cookie: { secure: false } ,
  store: store,            // Set to true if using HTTPS
}));

//Setup static file serving

app.use(serveStaticIfExists(global.__app_path));

//Limit multer upload to one action

const multerMiddleWare = (req,res,next) => {
  if(req.query.action != 'upload_file') {
      upload.none()(req,res,next);
  } else {
    next()
  }
 
}

// Redirect all requests to router
app.all('/{*any}', multerMiddleWare, async (req, res) => {
  const context = {
    req,
    res,
    session: req.session
  }

  await router.execute(context);
});

//Start server

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});