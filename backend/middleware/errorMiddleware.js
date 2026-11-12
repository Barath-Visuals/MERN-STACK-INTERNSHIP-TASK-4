export const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`)
    error.statusCode = 404

    next(error)
}


export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500

    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal server error.',
    })
}
