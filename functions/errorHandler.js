const throwError = (text, status) => {
    const err = new Error(text);
    err.status = status;
    throw(err);
}

module.exports = {
    throwError
}