const router = require('express').Router();
const matchingController = require('../controllers/matching');

router.post('/search/matching',matchingController.matching);
router.get('/getdata',matchingController.getData);
router.post('/search/searchStaff',matchingController.searchStaff);


module.exports = router;