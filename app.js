//express framework
const express = require('express');
//logger (console)
const morgan = require('morgan');

//express app
const app = express();

//registering view engine
app.set('view engine', 'ejs');

//log every request in console - dev mode
app.use(morgan('dev'));

//parsing request bodies
app.use(express.urlencoded({extended: true}));

//require employee routes
const employeeRoutes = require('./routes/employeeRoutes');

//require department routes
const departmentRoutes = require('./routes/departmentRoutes');

//listen for requests
app.listen(3000, () => {
    console.log('Listening for requests at http://localhost:3000');
});

//homepage route - redirects to employees
app.get('/', (request, response) => {
    response.redirect('/employees');
});

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