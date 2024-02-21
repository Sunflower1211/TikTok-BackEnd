const errorHandler = async (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    //duplication
    if (err.code === 11000) {
        err.statusCode = 400;
        for (let p in err.keyvalue) {
            err.message = `${p} have to be unique`;
        }
    }

    //objectId: not found
    if (err.kind === 'ObjectId') {
        err.statusCode = 404;
        err.message = `the ${req.originalUrl} is not found because of wrong ID`;
    }

    //validation
    if (err.errors) {
        err.statusCode = 400;
        err.message = err.message;
    }

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
    });
};

module.exports = {
    errorHandler,
};
