const other = require('express').Router();

//#region test route
other.get('/test', (req, res) => {

    console.log("Test worked yay !!")
    res.setHeader("Content-Type", "application/json"); // Typage de la data de retour
    res.status(200).json({message: "bonjour ProjetNodeAJ"});
})
//#endregion

//#region test route
other.get('/test2', (req, res) => {

    console.log("Test worked yay !!")
    res.setHeader("Content-Type", "application/json"); // Typage de la data de retour
    res.status(200).json({message: "bonjour ProjetNodeAJ deuxieme test"});
})
//#endregion




module.exports = other;