import express from 'express';
import router from './routing.js';
import session from 'express-session';
import SequelizeStoreFactory from 'connect-session-sequelize';
import serveStaticIfExists from './serveStatic.js';
const app = express();

const SequelizeStore = SequelizeStoreFactory(session.Store);

//Set Port

const port = (process.argv[2] ? process.argv[2] : 80 );

//Setup Multer for file uploads

import multer from 'multer';
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
  secret: global.__env.SESSION_SECRET || 'dev-only-change-me',
  resave: false,                        // Don't save session if unmodified
  saveUninitialized: false,             // Don't create session until something stored
  cookie: { secure: global.__env.NODE_ENV === 'production' } ,
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