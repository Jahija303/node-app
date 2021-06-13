//employees_index, employee_index_status, employees_details, employees_department, employees_create_get, employees_create_post

//require employee model
const Employee = require('../models/employee.js');
//require employeeSeeder
const employees = require('../seeders/employeeSeeder');

//controller functions that manage the logic of every /employee request
const employees_index = (request, response) => {
    response.render('employees/index', { title: 'Employees', employees: employees, headline: 'All Employees' });
}

const employees_index_status = (request, response, next) => {
    //get the status value from url
    let status = request.params.status;

    //check if it is indeed a status parameter
    if(status == 'true' || status == 'false') {
        //parse the string to a bool value
        status = JSON.parse(status);
        
        //filter the array to only contain employees with matching status
        let employeesByStatus = employees.filter(employee => employee.status == status);

        //render the response with new array
        response.render('employees/index', { title: 'Employees', employees: employeesByStatus, headline: `All ${status ? 'active' : 'inactive'} employees` });
    } else {
        //continue with the request matching against the uri's
        next();
    } 
}

const employees_details = (request, response) => {

    //get the id from the url
    const id = request.params.id;

    //check if provided parameter is not a number
    if(isNaN(id)) {
        response.status(400).render('error', { title: 'Error', error: 'Parameter you provided is not a valid ID' });
    } 
    //if it is a number, proceed with code
    else {

        //check if the employee with the provided id exists 
        if(employees.find(employee => employee.id == id)) {

            //assing the employee to a variable which will be forwarded
            let employee = employees.find(employee => employee.id == id)
            
            //render the response with the selected employee
            response.render('employees/detail', { title: 'Employee Detail', employee: employee });

        } else {
            //render the error page if an employee has not been found
            response.status(400).render('error', { title: 'Not Found', error: 'Employee does not exists...' });
        }
    }

}

const employees_department = (request, response) => {

    //default status value
    let status = true;

    //if status value exists in the URI
    if(request.params.status) {
        status = JSON.parse(request.params.status);
    }

    //get the department id from the URI
    const departmentid = request.params.departmentid;

    //check if provided parameter is a number, and check if it is a valid one (0-2)
    if(!isNaN(departmentid) && departmentid >= 0 && departmentid <=2) {

        //filter the array to match the employees by department and add the provided status filter
        let employeesByDepartment = employees.filter(employee => employee.departmentid == departmentid && employee.status == status);

        //declare department variable (for frontend headline purposes)
        let department;

        //assign string value based on department id
        switch(departmentid) {
            case '0':
                department = 'Development';
                break;
            case '1':
                department = 'Management';
                break;
            case '2':
                department = 'HR';
                break;
        }

        //render the response
        response.render('employees/index', { title: 'Employees', employees: employeesByDepartment, headline: `All Employees in the ${department} department` });
    }
    else {
        //render the error page if the department id is not valid or not a number
        response.status(400).render('error', { title: 'Error', error: 'Parameter you provided is not a valid department ID' });
    }
}

const employees_create_get = (request, response) => {
    response.render('employees/create', { title: 'Add an employee' });
}

const employees_create_post = (request, response) => {
    
    try {
        //check if the input fields are valid..
        let id = employees[employees.length-1].id + 1;
        let name = request.body.name;
        let lastname = request.body.lastname;
        let department = parseInt(request.body.department);
        let status = JSON.parse(request.body.status);

        //create a new instance of the Employee class with the provided fields
        const newEmployee = new Employee(id, name, lastname, department, status);

        //add the new employee to the array
        employees.push(newEmployee);
        
    } catch(e) {
        //render the error page if an error is thrown
        response.status(400).render('error', { title: 'Error', error: e });
    }

    //redirect to employees page
    response.redirect('/employees');
}

//exporting the functions
module.exports = {
    employees_index,
    employees_index_status,
    employees_details,
    employees_department,
    employees_create_get,
    employees_create_post
}