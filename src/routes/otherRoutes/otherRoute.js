const other = require('express').Router();

//#region test route
other.get('/test', (req, res) => {

    console.log("Test worked yay !!")
    res.setHeader("Content-Type", "application/json"); // Typage de la data de retour
    res.status(200).json({message: "bonjour ProjetNodeAJ"});
})
//#endregion



module.exports = other;