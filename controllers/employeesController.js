//employees_index, employee_index_status, employees_details, employees_department

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

        //declare employee variable out of the 'if statement' scope
        let employee;

        //check if employee exists and assign him to a new variable to be forwarded
        if(employees.find(employee => employee.id == id)) {

            employee = employees.find(employee => employee.id == id);
            
            //render the response with the selected employee
            response.render('employees/detail', { title: 'Employee Detail', employee: employee });

        } else {
            //render the error page if an employee has not been found
            response.status(400).render('error', { title: 'Not Found', error: 'Employee does not exists...' });
        }
    }

}

const employees_department = (request, response) => {

    //get the department id from the URI
    const departmentid = request.params.departmentid;

    //check if provided parameter is a number, and check if it is a valid one (0-2)
    if(!isNaN(departmentid) && departmentid >= 0 && departmentid <=2) {

        //filter the array to match the employees by department
        let employeesByDepartment = employees.filter(employee => employee.departmentid == departmentid && employee.status == true);

        //declare department variable
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
    //if it is not number, or if is invalid - proceed with code
    else {
        //render the error page if the department id is not valid
        response.status(400).render('error', { title: 'Error', error: 'Parameter you provided is not a valid department ID' });
    }
}

//exporting the functions
module.exports = {
    employees_index,
    employees_index_status,
    employees_details,
    employees_department
}