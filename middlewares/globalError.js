const ErrorApi = require("../utils/Errors/errorAPI");

const sendErrorToDevelopmentMode = (error, res) => {
    return res
        .status(error.statuscode)
        .json({
            status: error.status,
            error: error,
            stack: error.stack,
            message: error.message,
        });
}


const sendErrorToProductionMode = (error, res) => {
    return res
        .status(error.statuscode)
        .json({
            status: error.status,
            message: error.message,
        });
}

const invalidTokenSignature = ()=> {
    return new ErrorApi(`Invalid Token , try login again` , 401);
}

const invalidTokenExpired = ()=> {
    return new ErrorApi(`Expired Token , try login again` , 401);
}

const centerErrorMiddleware = (error, req, res, next) => {
    error.statuscode = error.statuscode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV == "development") {
        sendErrorToDevelopmentMode(error, res);
    }
    else {
        if(error.name == "JsonWebTokenError") {
           error = invalidTokenSignature();
        }
        else if (error.name == "TokenExpiredError") {
            error = invalidTokenExpired();
        }
        sendErrorToProductionMode();
    }
};


module.exports = centerErrorMiddleware;
