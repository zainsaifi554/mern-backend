
const HelperFunction = (res, status, error, data, message) => {
    res.status(status).json({
        error: error,
        data: data,
        message: message,
    })
}

export default HelperFunction;