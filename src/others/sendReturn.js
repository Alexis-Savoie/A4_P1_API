const sendReturn = (
    res,
    status = 500,
    data =
        {
            error: true,
            message: "Processing error"
        }
) => {
    res.setHeader("Content-Type", "application/json"); // Typage de la data de retour
    res.status(status).json(data);
};

module.exports = {
    sendReturn: sendReturn
};