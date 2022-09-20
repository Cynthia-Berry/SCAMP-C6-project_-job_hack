require('dotenv').config();


const express = require('express'), path = require('path');
const createError = require('http-errors');

global.appRoot = path.resolve(__dirname);
global.appName = 'Job Hack';
global.version = 'v1';
global.patchVersion = 'v1.0.0';

const app = express();
const port = process.env.PORT || 5000;
require('./server/middlewares/utils/logger');
require('./server/config/database');
const indexRouter = require('./server/routes/index');
const authRouter = require('./server/routes/auths/auth.route');
const adminAuthRouter = require('./server/routes/auths/admin.auth.route');
const clientAuthRouter = require('./server/routes/auths/client.auth.route');
const companyAuthRouter = require('./server/routes/auths/company.auth.route');
const adminProfileRouter = require('./server/routes/users/admin.user.route');
const clientProfileRouter = require('./server/routes/users/client.user.route');
const companyProfileRouter = require('./server/routes/company/company.route');
const categoryRouter = require('./server/routes/resources/category.route');
const educationRouter = require('./server/routes/resources/education.route');
const documentRouter = require('./server/routes/resources/document.route');
const skillRouter = require('./server/routes/resources/skill.route');


// set headers (handling cors error)
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Accept", "application/json");
	res.header("Access-Control-Allow-Credentials", 'true');
	next();
});

// set the req body (parses the body that comes with post/put requests )
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'server/public')));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminAuthRouter);
app.use('/client', clientAuthRouter);
app.use('/company', companyAuthRouter);
app.use('/admin-profile', adminProfileRouter);
app.use('/client-profile', clientProfileRouter);
app.use('/company-profile', companyProfileRouter);
app.use('/category', categoryRouter);
app.use('/education', educationRouter);
app.use('/document', documentRouter);
app.use('/skill', skillRouter);


app.listen(port, () =>
	console.log(`[${appName}]: Node Development Server is listening on localhost:${port}, open your browser on: http://localhost:${port}/`)
);

app.use((req, res, next) => {
	next(createError(404, 'This URL does not exist!'));
});
