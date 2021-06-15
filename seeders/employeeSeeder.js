//require employee model
const Employee = require('../models/employee.js');

//assign dummy data to employee models 
const Employee1 = new Employee(1,'Jahija','Okan',1,true);
const Employee2 = new Employee(2,'John','Smith',2,false);
const Employee3 = new Employee(3,'Morgan','Freeman',0,true);
const Employee4 = new Employee(4,'Leonardno','DiCaprio',1,false);

//create an empty array where employees will be stored
const employees = [];

//pushing pre made employees into the employee array
employees.push(Employee1);
employees.push(Employee2);
employees.push(Employee3);
employees.push(Employee4);

//export employees
module.exports = employees;