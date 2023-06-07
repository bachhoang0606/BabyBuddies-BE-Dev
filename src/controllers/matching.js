const staff = require('../models/staff')
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

const searchStaff = async (req, res) => {

            // let filters = req.body;
            // const regex = new RegExp(filters, "i");
            // staffs = await Staff.find({ $or: [{ fullName: regex }, { address: regex }, { gender: regex }, { phone: regex }, { email: regex }, { birthday: regex }] }).exec()
            // console.log(employees)
            // return res.json(staffs);

            console.log(req.body)
}


module.exports = { matching, getData, searchStaff }