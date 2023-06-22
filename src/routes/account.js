const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const accoutnController = require('../controllers/account');

/* eslint-disable prettier/prettier */
router.get('/accounts/:accountId', asyncMiddleware(accoutnController.findAccount));
router.post('/accounts/:accountId/update', asyncMiddleware(accoutnController.updateAccount));
/* eslint-enable prettier/prettier */
module.exports = router;
