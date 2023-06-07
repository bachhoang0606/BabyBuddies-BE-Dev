const Staff = require('../models/staff')
const matchingService = require('../services/matching')


const matching = async (req, res) => {
    
    let textFilters = req.body 
    let data = await matchingService.searchStaff(textFilters)
    return res.json(data);
    
}

const getData = async (req, res) => {
    const data = await Staff.find({})
    return res.json(data);
}


module.exports = { matching, getData }