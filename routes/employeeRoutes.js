//express framework
const express = require('express');
//requires employeeController
const employeesController = require('../controllers/employeesController');
//instantiate a router to be exported
const router = express.Router();

//all employee routes
router.get('/', employeesController.employees_index);
router.post('/', employeesController.employees_create_post)
router.get('/:status', employeesController.employees_index_status);
router.get('/:id', employeesController.employees_details);
router.delete('/:id', employeesController.employees_delete_by_id);
router.put('/', employeesController.employees_put);

//export router
module.exports = router;