// Récuperer Sauce du dossier Model

const Sauce = require('../model/Sauce.js')

exports.create = (req, res, next) => {
  // Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON. Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
  const sauceObjet = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    // opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...sauceObjet,
    // Nous devons également résoudre l'URL complète de notre image.En fait, nous effectuons une demande GET vers http://localhost:3000/images.notre application s'exécute sur localhost:3000 et nous ne lui avons pas indiqué comment répondre aux requêtes transmises à cette route : elle renvoie donc une erreur 404. Pour remédier à cela, nous devons indiquer à notre app.js comment traiter les requêtes vers la route /image , en rendant notre dossier images statique.Il nous faudra une nouvelle importation dans app.js pour accéder au path de notre serveur :.
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  })
  // save() qui enregistre simplement votre Thing dans la base de données.renvoie une Promise.
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }))
}

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
