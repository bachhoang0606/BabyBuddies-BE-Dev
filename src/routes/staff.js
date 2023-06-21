const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const staffController = require('../controllers/staff');

/* eslint-disable prettier/prettier */
router.get('/staffs/:staffId', asyncMiddleware(staffController.findStaff));
/* eslint-enable prettier/prettier */
module.exports = router;
