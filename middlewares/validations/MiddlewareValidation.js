const {param , validationResult} = require("express-validator");

const MiddlewareValidation = (req , res , next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    next();
}

module.exports = MiddlewareValidation;

