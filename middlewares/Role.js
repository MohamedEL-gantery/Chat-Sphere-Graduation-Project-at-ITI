const AppError = require('../utils/appError');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            const error = new AppError('This role is not authorized', 401);
            return next(error); 
        }
        next(); 
    };
};
