//express framework
const express = require('express');
//requires employeeController
const employeesController = require('../controllers/employeesController');
//instantiate a router to be exported
const router = express.Router();

//all department routes
router.get('/:departmentid/employees/:status', employeesController.employees_department);
router.get('/:departmentid/employees', employeesController.employees_department);

//export router
module.exports = router;