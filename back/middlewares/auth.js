//Nous allons à présent créer le middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
// Dans ce middleware :
// nous extrayons le token du header Authorization de la requête entrante. N'oubliez pas qu'il contiendra également le mot-clé Bearer . Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch ;
// nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée ;
// nous extrayons l'ID utilisateur de notre token ;
// si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'udl*VFMnxp5Crly-({')
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    })
  }
}
