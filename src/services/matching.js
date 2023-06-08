const Staff = require('../models/staff')
const Language = require('../models/language');


let searchStaff = async (filters) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            

            function calculateAverageRating(staff) {
                if (!staff.rating || staff.rating.length === 0) {
                    return 0;
                }

                let totalRating = 0;
                for (const ratingObj of staff.rating) {
                    totalRating += ratingObj.star;
                }

                const averageRating = totalRating / staff.rating.length;
                return averageRating;
            }



            const employees = await Staff.find({})


            async  function calculateMatchingScore(employee, filters) {
                let matchingScore = 0;
                let numFailedConditions = 0;

                const { rating, salary, userLanguage, careExp, cookExp, address } = filters;
                // console.log({ rating, salary, userLanguage, careExp, cookExp })
                // console.log(employee)
                const averageRating = calculateAverageRating(employee);

                // console.log(averageRating)

                if (rating !== undefined) {
                    const hasMatchingRating = averageRating >= rating;
                    if (hasMatchingRating) {
                        matchingScore = matchingScore + 1.75;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }

                if (userLanguage !== undefined) {
                    const languageNames = await Language.find({ _id: { $in: employee.userLanguage } }).distinct('name');
                    // console.log(languageNames)
                    const isMatchingLanguage = languageNames.includes(userLanguage);
                    if (isMatchingLanguage) {
                        matchingScore = matchingScore + 2;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }

                // if (address !== undefined) {
                //     if (employee.salary <= salary) {
                //         matchingScore++;
                //     } else {
                //         numFailedConditions++;
                //     }
                // }



                if (salary !== undefined) {
                    if (employee.salary <= salary) {
                        matchingScore++;
                    } else {
                        numFailedConditions++;
                    }
                }

                if (careExp !== undefined) {
                    if (employee.careExp === careExp) {
                        matchingScore = matchingScore + 1.25;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }

                if (cookExp !== undefined) {
                    if (employee.cookExp === cookExp) {
                        matchingScore = matchingScore + 1.25;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }
               
                

                console.log(matchingScore +', '+ numFailedConditions);
                return { matchingScore, numFailedConditions };
            }

            // Hàm tìm kiếm nhân viên phù hợp nhất với các tiêu chí
            async function searchEmployees(filters){
                
                let matchedEmployees = [];
                    for (const employee of employees) {
                        const { matchingScore, numFailedConditions } = await calculateMatchingScore(
                        employee,
                        filters
                        );
                        if (numFailedConditions < 1) {
                        matchedEmployees.push(employee);
                        }
                    }

                // console.log(matchedEmployees[0])
                // return matchedEmployees

                return matchedEmployees.sort((a, b) => {
                    const scoreA = calculateMatchingScore(a, filters);
                    const scoreB = calculateMatchingScore(b, filters);
                    return scoreB - scoreA;
                });
            }

            async function searchFailEmployees(filters) {
                let matchedEmployees = [];
                    for (const employee of employees) {
                        const { matchingScore, numFailedConditions } = await calculateMatchingScore(
                        employee,
                        filters
                        );
                        if (numFailedConditions > 0) {
                        matchedEmployees.push(employee);
                        }
                    }

                matchedEmployees.sort((a, b) => {
                    const scoreA = calculateMatchingScore(a, filters);
                    const scoreB = calculateMatchingScore(b, filters);
                    return scoreB - scoreA;
                });
                output = matchedEmployees.slice(0, 3);
                // console.log(output);
                return output;
            }


            dataTestPostman = {
                // "rating": "2",
                "userLanguage" :"English",
                "salary" : "100000"
                // "careExp": "3",
                // "cookExp":"3"
            };

            let matchedStaffs = await searchEmployees(filters);

            if (matchedStaffs.length === 0) {
                    matchedStaffs = await searchFailEmployees(filters);
                    // console.log(count++)
                }

            resolve(matchedStaffs)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { searchStaff }