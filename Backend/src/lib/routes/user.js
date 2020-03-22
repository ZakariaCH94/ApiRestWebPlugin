const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/creerCompte', userController.signup);
router.post('/login', userController.login);
router.get('/', userController.hello);

 
module.exports = router;
