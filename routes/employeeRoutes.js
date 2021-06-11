//express framework
const express = require('express');
//requires employeeController
const employeesController = require('../controllers/employeesController');
//instantiate a router to be exported
const router = express.Router();

//all employee routes
router.get('/', employeesController.employees_index);
router.get('/:status', employeesController.employees_index_status);
router.get('/:id', employeesController.employees_details);

//export router
module.exports = router;