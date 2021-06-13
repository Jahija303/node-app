//employees_index, employee_index_status, employees_details, employees_department, employees_create_get, employees_create_post, employees_delete_by_id, employees_put

//require employee model
const Employee = require('../models/employee.js');
//require validator functions
const validator = require('../functions/validator.js');
//require errorHanlder functions
const errorHandler = require('../functions/errorHandler');
//require employeeSeeder
let employees = require('../seeders/employeeSeeder');

//controller functions that manage the logic of every /employee request
const employees_index = (request, response, next) => {
    //error handling
    try {
        response.render('employees/index', { title: 'Employees', employees: employees, headline: 'All Employees' });
    } catch(err) {
        next(err);
    }
}

const employees_index_status = (request, response, next) => {

    //error handling
    try {
        //get the status value from url
        let status = request.params.status;

        //check if it is indeed a status parameter
        if(validator.isStringBool(status)) {
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
    } catch(err) {
        next(err);
    }
}

const employees_details = (request, response, next) => {

    //error handling
    try {
        //get the id from the URI
        const id = request.params.id;

        //check if provided parameter is not a number
        if(isNaN(id)) {
            errorHandler.throwError("The parameter you provided is not a valid employee ID...", 400);
        } 
        //if it is a number, proceed with code
        else {

            //check if the employee with the provided id exists 
            if(employees.find(employee => employee.id == id)) {
                //assign the found employee to a variable which will be forwarded to frontend
                let employee = employees.find(employee => employee.id == id)
                
                //render the response with the selected employee
                response.render('employees/detail', { title: 'Employee Detail', employee: employee });

            } else {
                //render the error page if an employee has not been found
                errorHandler.throwError("The Employee you are looking for does not exist...", 404);
            }
        }
    } catch(err) {
        next(err);
    }

}

const employees_department = (request, response, next) => {

    //default status value
    let status = true;

    try {
        //if status value exists in the URI
        if(request.params.status) {
            status = request.params.status;
            
            //check if the status syntax is valid
            if(validator.isStringBool(status)) {
                status = JSON.parse(status);
            } else {
                errorHandler.throwError("Parameter you provided is not a valid status option, please use true/false..", 400);
            }
        }

        //get the department id from the URI
        const departmentid = request.params.departmentid;

        //check if provided parameter is a number, and check if it is a valid one (0-2)
        if(validator.validateDepartment(departmentid)) {

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
            errorHandler.throwError("Parameter you provided is not a valid department ID...", 400);
        }
    } catch(err) {
        next(err);
    }
}

const employees_create_get = (request, response, next) => {
    try {
        response.render('employees/create', { title: 'Add an employee' });
    } catch(err) {
        next(err);
    }
}

const employees_create_post = (request, response, next) => {
    
    try {
        //check if the input fields are valid..
        let id = employees[employees.length-1].id + 1;
        let name = request.body.name;
        let lastname = request.body.lastname;
        
        //check the department id
        let departmentid = request.body.departmentid;
        if(validator.validateDepartment(departmentid)) {
            departmentid = parseInt(departmentid);   
        } else {
            errorHandler.throwError("Parameter you provided is not a valid department ID...", 400);
        }

        //check if the status syntax is valid
        let status = request.body.status;
        if(validator.isStringBool(status)) {
            status = JSON.parse(status);
        } else {
            errorHandler.throwError("Parameter you provided is not a valid status option, please use true/false..", 400);
        }

        //create a new instance of the Employee class with the provided fields
        const newEmployee = new Employee(id, name, lastname, departmentid, status);

        //add the new employee to the array
        employees.push(newEmployee);

        //redirect to employees page
        response.redirect('/employees');
        
    } catch(err) {
        //render the error page if an error is thrown
        next(err);
    }
}

const employees_delete_by_id = (request, response, next) => {
    //error handling
    try {
        //get the id from the URI
        const id = request.params.id;

        //check if provided parameter is not a number
        if(isNaN(id)) {
            errorHandler.throwError("The parameter you provided is not a valid employee ID...", 400);
        } 
        //if it is a number, proceed with code
        else {
            //check if the employee with the provided id exists 
            if(employees.find(employee => employee.id == id)) {
                //assign the found employee to a variable
                let employee = employees.find(employee => employee.id == id)
                
                //remove the employee from the array
                employees.splice(employees.indexOf(employee), 1);

                //render the employees page
                response.redirect('/employees');

            } else {
                //render the error page if an employee has not been found
                errorHandler.throwError("The Employee you are looking for does not exist...", 404);
            }
        }
    } catch(err) {
        next(err);
    }
}

const employees_put = (request, response, next) => {

    try {

        //read the id from the request
        const id = request.body.id;

        if(!id) {
            errorHandler.throwError("Please enter an employee ID...", 400);
        }

        if(isNaN(id)) {
            errorHandler.throwError("Invalid ID, please provide a valid one...", 404);
        }
        //if it is a number, proceed with code
        else {

            //check if the employee with the provided id exists 
            if(employees.find(employee => employee.id == id)) {

                //assign the found employee to a variable
                let employee = employees.find(employee => employee.id == id)

                //assign the index of the employee
                let index = employees.indexOf(employee);

                //assign each value from the request body to the employee model
                employee.id = id;

                if(request.body.name) {
                    employee.name = request.body.name;
                }

                if(request.body.lastname) {
                    employee.lastname = request.body.lastname;
                }

                //check the department id
                let departmentid = request.body.departmentid;
                if(validator.validateDepartment(departmentid)) {
                    departmentid = parseInt(departmentid);
                    employee.departmentid = departmentid;   
                } else {
                    errorHandler.throwError("Parameter you provided is not a valid department ID...", 400);
                }

                //check if the status syntax is valid
                let status = request.body.status;
                if(validator.isStringBool(status)) {
                    status = JSON.parse(status);
                    employee.status = status;
                } else {
                    errorHandler.throwError("Parameter you provided is not a valid status option, please use true/false..", 400);
                }

                //update the main array with the new employee
                employees[index] = employee;

                //render the employees page
                response.redirect('/employees');

            } else {
                //render the error page if an employee has not been found
                errorHandler.throwError("The Employee you are looking for does not exist...", 404);
            }
        }

    } catch(err) {
        next(err);
    }

}

//exporting the functions
module.exports = {
    employees_index,
    employees_index_status,
    employees_details,
    employees_department,
    employees_create_get,
    employees_create_post,
    employees_delete_by_id,
    employees_put
}