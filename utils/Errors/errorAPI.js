class ErrorApi extends Error {
    constructor(message, statuscode) {
        super(message); // super is used to invoke property from parent class :: in this case :: Error 
        this.statuscode = statuscode;
        this.status = `${statuscode}`.startsWith(4) ? "fail" : "error";
        this.isOperational = true;
    }
}


module.exports = ErrorApi;