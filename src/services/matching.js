const Staff = require('../models/staff');
const Language = require('../models/language');

const searchStaff = async (filters) => {
    try {
        function calculateAverageRating(staff) {
            if (!staff.rating || staff.rating.length === 0) {
                return 0;
            }

            const totalRating = staff.rating.reduce(
                (sum, ratingObj) => sum + ratingObj.star,
                0
            );
            const averageRating = totalRating / staff.rating.length;
            return averageRating;
        }

        const employees = await Staff.find({});

        async function calculateMatchingScore(employee, filters) {
            let matchingScore = 0;
            let matchingScore1 = 0;
            let matchingScore2 = 0;
            let matchingScore3 = 0;
            let matchingScore4 = 0;
            let matchingScore5 = 0;

            const { rating, salary, userLanguage, careExp, cookExp, address } = filters;
            const averageRating = calculateAverageRating(employee);

            if (rating !== undefined) {
                if (averageRating === rating) {
                    matchingScore1 = 100;
                } else if (averageRating < rating) {
                    matchingScore1 = (averageRating * 100) / rating;
                } else {
                    matchingScore1T = ((rating - (averageRating - rating)) * 100) / rating;
                    if(matchingScore1T >= 0) {
                        matchingScore1 = matchingScore1T;
                    }else{
                        matchingScore1 = 0;
                    }
                }
            }

            if (userLanguage !== undefined) {
                const userLanguages = Array.isArray(userLanguage) ? userLanguage : [userLanguage];
                const userLanguageNames = await Language.find({ _id: { $in: employee.userLanguage } }).distinct('name');
                const matchingLanguageCount = userLanguages.reduce((count, lang) => {
                    if (userLanguageNames.includes(lang)) {
                        return count + 1;
                    }
                    return count;
                }, 0);
                matchingScore2 = (matchingLanguageCount / userLanguages.length) * 100;
                // console.log(matchingScore2);
            }

            if (salary !== undefined) {
                if (employee.salary === salary) {
                    matchingScore3 = 100;
                } else if (employee.salary < salary) {
                    matchingScore3 = (employee.salary * 100) / salary;
                } else {
                    matchingScore3T =
                        ((salary - (employee.salary - salary)) * 100) / salary;
                        if(matchingScore3T >= 0) {
                            matchingScore3 = matchingScore3T;
                        }else{
                            matchingScore3 = 0;
                        }
                }
            }

            if (careExp !== undefined) {
                const experienceValues = {
                    'non': 0,
                    '1 years': 1,
                    '2 years': 2,
                    '3 years': 3,
                    '> 3 years': 4,
                };
                const employeeYears = experienceValues[employee.careExp];
                const filterYears = experienceValues[careExp];
                if (employeeYears === filterYears) {
                    matchingScore4 = 100;
                } else if (employeeYears > filterYears) {
                    matchingScore4T =
                        ((filterYears - (employeeYears - filterYears)) * 100) /
                        filterYears;
                        if(matchingScore4T >= 0) {
                            matchingScore4 = matchingScore4T;
                        }else{
                            matchingScore4 = 0;
                        }
                } else {
                    matchingScore4 = (employeeYears * 100) / filterYears;
                }
            }

            if (cookExp !== undefined) {
                const experienceValues = {
                    'non': 0,
                    '1 years': 1,
                    '2 years': 2,
                    '3 years': 3,
                    '> 3 years': 4,
                };
                const employeeYears = experienceValues[employee.cookExp];
                const filterYears = experienceValues[cookExp];
                if (employeeYears === filterYears) {
                    matchingScore5 = 100;
                } else if (employeeYears > filterYears) {
                    matchingScore5T =
                        ((filterYears - (employeeYears - filterYears)) * 100) /
                        filterYears;
                        if(matchingScore5T >= 0) {
                            matchingScore5 = matchingScore5T;
                        }else{
                            matchingScore5 = 0;
                        }
                } else {
                    matchingScore5 = (employeeYears * 100) / filterYears;
                }
            }

            matchingScore =
                (matchingScore1 +
                    matchingScore2 +
                    matchingScore3 +
                    matchingScore4 +
                    matchingScore5) /
                5;

            return matchingScore;
        }

        async function searchEmployees(filters) {
            const matchingPromises = employees.map((employee) =>
                calculateMatchingScore(employee, filters)
            );
            const matchingResults = await Promise.all(matchingPromises);
        
            const matchedEmployees = [];
            for (let i = 0; i < employees.length; i++) {
                const employee = employees[i];
                const matchingScore = matchingResults[i];
                const userLanguageNames = await Language.find({
                    _id: { $in: employee.userLanguage },
                }).distinct('name');
                const employeeWithuserLanguageName = {
                    ...employee._doc,
                    userLanguageNames,
                    matchingScore: matchingScore.toFixed(2) + '%',
                };
                matchedEmployees.push(employeeWithuserLanguageName);
            }
        
            // Sắp xếp danh sách nhân viên theo điểm phù hợp giảm dần
            // matchedEmployees.sort((a, b) => b.matchingScore - a.matchingScore);
            matchedEmployees.sort((a, b) => parseFloat(b.matchingScore) - parseFloat(a.matchingScore));

            return matchedEmployees;
            // const output = matchedEmployees.slice(0, 10);
            // return output;
        }

        const matchedStaffs = searchEmployees(filters);

        return matchedStaffs;
    } catch (error) {
        throw error;
    }
};

module.exports = { searchStaff };
