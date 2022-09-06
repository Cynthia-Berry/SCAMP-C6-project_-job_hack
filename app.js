require('dotenv').config();
require('./server/config/database');


const express = require('express'), swaggerUi = require('swagger-ui-express');
const path = require('path');

global.appRoot = path.resolve(__dirname);
global.appName = 'App name';
global.version = 'v1';
global.patchVersion = 'v1.0.0';

const app = express();
const port = process.env.PORT || 5000;

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');
// set the req body (parses the body that comes with post/put requests )
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'server/public')));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// set headers (handling cors error)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Accept", "application/json");
  res.header("Access-Control-Allow-Credentials", 'true');
  next();
});

app.listen(port, () =>
  console.log(`[${appName}]: Node Development Server is listening on localhost:${port}, open your browser on: http://localhost:${port}/`)
);


app.use((req, res, next) => {
  next(createError(404, 'This URL does not exist!'));
});
