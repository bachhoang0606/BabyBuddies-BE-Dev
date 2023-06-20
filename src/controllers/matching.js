const Staff = require('../models/staff');
const Language = require('../models/language');
const matchingService = require('../services/matching');

const PAGE_SIZE = 8;

const matching = async (req, res) => {
    let textFilters = req.body;
    let data = await matchingService.searchStaff(textFilters);
    return res.json(data);
};

const getData = async (req, res) => {
    const data = await Staff.find({});
    return res.json(data);
};
const allStaff = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Số trang, mặc định là 1
        // console.log(req.query.page)
        const skip = (page - 1) * PAGE_SIZE; // Số bản ghi cần bỏ qua
        const totalDocuments = await Staff.countDocuments({}); // Tổng số bản ghi

        const staff = await Staff.find({}).skip(skip).limit(PAGE_SIZE); // Lấy danh sách bản ghi phân trang
        for (let i = 0; i < staff.length; i++) {
            const staffItem = staff[i];
            const languageIds = staffItem.userLanguage;

            // Truy vấn tên ngôn ngữ từ các ID ngôn ngữ
            const languages = await Language.find({
                _id: { $in: languageIds },
            });

            // Lấy danh sách tên ngôn ngữ và gán vào thuộc tính 'languageNames' của mỗi bản ghi
            staff[i] = {
                id: staffItem._id,
                address: staffItem.address,
                birthday: staffItem.birthday,
                careExp: staffItem.careExp,
                cookExp: staffItem.cookExp,
                email: staffItem.email,
                fullName: staffItem.fullName,
                gender: staffItem.gender,
                phone: staffItem.phone,
                rating: staffItem.rating,
                salary: staffItem.salary,
                // userLanguage: staffItem.userLanguage,
                userLanguage: languages.map((language) => language.name),
            };
        }

        const totalPages = Math.ceil(totalDocuments / PAGE_SIZE); // Tổng số trang

        res.status(200).json({
            totalDocuments,
            totalPages,
            currentPage: page,
            staff,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { matching, getData, allStaff };
