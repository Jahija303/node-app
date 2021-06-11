//Employee class
class Employee {
    constructor(id, name, lastname, departmentid, status) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.departmentid = departmentid;
        this.status = status;
    }
}

//exporting the class
module.exports = Employee;