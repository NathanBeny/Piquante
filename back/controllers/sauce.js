//  nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs')
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

// Mettez à jour un Thing existant

exports.update = (req, res, next) => {
  //2 Dans cette version modifiée de la fonction, on crée un objet thingObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }

  //

  // 3 Pour suppr anciennes img
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //       l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
        // nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
        // nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
        // dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          // La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() dans le sens où nous lui passons un objet correspondant au document à supprimer.

          Sauce.updateOne(
            // 1Savoir quelles objet on modifie
            { _id: req.params.id },
            //Nouvelle version de l'objet
            {
              // ...req.body
              ...sauceObject,
              // Id corespond a celui des parametre
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch((error) => res.status(400).json({ error }))
        })
      })
      .catch((error) => res.status(500).json({ error }))
  } else {
    Sauce.updateOne(
      // 1Savoir quelles objet on modifie
      { _id: req.params.id },
      //Nouvelle version de l'objet
      {
        // ...req.body
        ...sauceObject,
        // Id corespond a celui des parametre
        _id: req.params.id,
      }
    )
      //retour d'une promise
      .then(() => res.status(200).json({ message: 'Sauce MAJ !' }))
      .catch((error) => res.status(400).json({ error }))
  }
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

// Récupération d'un Thing spécifique

exports.OneSauce = (req, res, next) => {
  //utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }))
}

//Suppression d'un Thing
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //       l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
      // nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      // nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
      // dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        // La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() dans le sens où nous lui passons un objet correspondant au document à supprimer.

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}
