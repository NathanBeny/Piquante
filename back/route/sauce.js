const express = require('express')
const router = express.Router()
// Récupere controllers
const sauce = require('../controllers/sauce')

//Import du middleware auth pour sécuriser les routes
const auth = require('../middlewares/auth')
//Import du middleware multer pour la gestion des images
const multer = require('../middlewares/multer-config')

// L'ordre des middlewares est important ! Si nous devons placer multer avant le middleware d'authentification, même les images des requêtes non authentifiées seront enregistrées dans le serveur. Veillez à placer multer après auth !

// logique de notre route POST en tant que fonction appelée =>

router.put('/:id', auth, multer, sauce.update)
router.post('/', auth, multer, sauce.create)

router.get('/', auth, sauce.list)
router.get('/:id', auth, sauce.OneSauce)

router.delete('/:id', auth, sauce.delete)
module.exports = router
