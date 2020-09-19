const errorHandler = (err,req,res,next) => {
    return res.status(err.status || 500).json({
        error: {
            message: err.message || "OOPS! SOmething went wrong"
        }
    });
}

module.exports = errorHandler;