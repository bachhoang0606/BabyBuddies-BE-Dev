const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const { loginValidate, registerValidate } = require('../validations/auth');
const authController = require('../controllers/auth');
const homeController = require('../controllers/home');

router.get('/home', asyncMiddleware(homeController.home));

/* eslint-disable prettier/prettier */
router.post('/auths/register', registerValidate, asyncMiddleware(authController.register));
router.post('/auths/login', loginValidate, asyncMiddleware(authController.login));
router.get('/auths/verify', auth, asyncMiddleware(authController.verifyAccessToken));
/* eslint-enable prettier/prettier */
module.exports = router;
