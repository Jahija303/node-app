const isStringBool = (value) => {
    return value == 'true' || value == 'false';
}

const validateDepartment = (value) => {
    return !isNaN(value) && value >= 0 && value <=2
}

module.exports = {
    isStringBool,
    validateDepartment
}