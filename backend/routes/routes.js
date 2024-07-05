const express = require('express');
const { regUser, loginUser, saveMsg, saveUser } = require('../controller/registraion');
const { update } = require('../controller/updateRoom');
const router = express.Router()

router.post('/register', regUser)
router.post('/Update', update)

router.post('/login',loginUser)

router.post('/msg',saveMsg)


router.post('/getUser',saveUser)

module.exports = router;