//express framework
const express = require('express');
//require morgan logger
const morgan = require('morgan');
//require file system
const fs = require('fs')
//require paths
const path = require('path');
//require employee routes
const employeeRoutes = require('./routes/employeeRoutes');
//require department routes
const departmentRoutes = require('./routes/departmentRoutes');
//translate controller
const translate_json = require('./controllers/translateController');

//express app
const app = express();

//registering view engine
app.set('view engine', 'ejs');

//parsing request bodies
app.use(express.urlencoded({extended: true}));

//setup the logger
//create a write stream for the logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/app.log'), {flags: 'a'})
//log every request in console - dev mode
app.use(morgan('dev'));
//use the morgan logger for requests
app.use(morgan('Request: :date[web] - :method :url ', { stream: accessLogStream }))
//use the morgan logger for response
app.use(morgan('Response: status code :status, :response-time ms', { stream: accessLogStream } ));

//listen for requests
app.listen(3000, () => {
    console.log('Listening for requests at http://localhost:3000');
});

//ROUTES
//homepage route - redirects to employees
app.get('/', (request, response) => {
    response.redirect('/employees');
});

//translate route
app.post('/translate/json', translate_json);

//all employee routes
app.use('/employees', employeeRoutes);

//department routes
app.use('/department', departmentRoutes);

//renders 404 page if none of the URI's match
app.use((request, response) => {
    response.status(404).render('error', { title: 'Error 404', error: 'OOPS, page not found' });
});

//catch-all error handler
app.use((err, request, response, next) => {
    const status = err.status || 500;
    response.status(status);
    response.render('error', { title: 'Error ' + status, error: err });
});