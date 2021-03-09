const express = require('express')
const router = express.Router()
// Récupere controllers
const sauce = require('../controllers/sauce')
// logique de notre route POST en tant que fonction appelée =>
router.get('/', sauce.list)

module.exports = router
