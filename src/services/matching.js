const Staff = require('../models/staff')
const Language = require('../models/language');


let searchStaff = async (filters) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(textFilters);
            // const filters = JSON.parse(textFilters);


            // const staffRecord = {
            //     "id": "647c837b3419345c6ec1d7fd",
            //     "address": " GIA LAM, HA NOI",
            //     "birthday": "2003-06-12T00:00:00.000Z",
            //     "care_exp": "3 years",
            //     "cook_exp": "3 years",
            //     "email": "20209459@mail.com",
            //     "full_name": "Le Gia Phat",
            //     "gender": "male",
            //     "phone": 45266003,
            //     "rating": [
            //         {
            //             "review": "very bad",
            //             "star": 1,
            //             "user_id": "1"
            //         },
            //         {
            //             "review": "good",
            //             "star": 4,
            //             "user_id": "1"
            //         }
            //     ],
            //     "salary": 100000,
            //     "user_language": [
            //         "647b51a98af6c322511fecb4",
            //         "647b51a98af6c322511fecb4",
            //         "647b51a98af6c322511fecb3"
            //     ]
            // };
            //     const averageRating = calculateAverageRating(staffRecord);
            //     console.log(averageRating); // Kết quả: 2.5




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

                const { rating, salary, userLanguage, careExp, cookExp } = filters;
                // console.log({ rating, salary, userLanguage, careExp, cookExp })
                // console.log(employee)
                const averageRating = calculateAverageRating(employee);

                console.log(averageRating)

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




                if (salary !== undefined) {
                    if (employee.salary <= salary) {
                        matchingScore++;
                    } else {
                        numFailedConditions++;
                    }
                }

                if (careExp !== undefined) {
                    if (employee.careExp >= careExp) {
                        matchingScore = matchingScore + 1.5;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }

                if (cookExp !== undefined) {
                    if (employee.cookExp >= cookExp) {
                        matchingScore = matchingScore + 1.25;
                    } else {
                        numFailedConditions = numFailedConditions + 1;
                    }
                }
               
                

                // console.log(matchingScore +', '+ numFailedConditions);
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
                        if (numFailedConditions < 1) {
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

            let matchedStaffs = await searchFailEmployees(filters);
            // console.log(matchedStaffs);

            // if (matchedStaffs.length === 0) {
            //         matchedStaffs = await searchFailEmployees(filters);
            //         // console.log(count++)
            //     }
                // console.log(matchedStaffs);

            resolve(matchedStaffs)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { searchStaff }