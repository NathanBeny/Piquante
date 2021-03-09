// Récuperer Sauce du dossier Model

const Sauce = require('../model/Sauce.js')

// Voir ttes lles Sauces
//logique métier de la route POST vers notre contrôleur
exports.list = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      })
    })
}
