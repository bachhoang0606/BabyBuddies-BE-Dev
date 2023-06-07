const router = require('express').Router();
const matchingController = require('../controllers/matching');

router.post('/search/matching',matchingController.matching);
router.get('/getdata',matchingController.getData);


module.exports = router;