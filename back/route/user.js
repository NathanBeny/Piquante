const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
// routes fournies sont celles prévues par l'application front-end.

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router
