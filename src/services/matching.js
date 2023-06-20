const Staff = require('../models/staff');
const Language = require('../models/language');

const searchStaff = async (filters) => {
  try {
    function calculateAverageRating(staff) {
      if (!staff.rating || staff.rating.length === 0) {
        return 0;
      }

      const totalRating = staff.rating.reduce((sum, ratingObj) => sum + ratingObj.star, 0);
      const averageRating = totalRating / staff.rating.length;
      return averageRating;
    }

    const employees = await Staff.find({});

    async function calculateMatchingScore(employee, filters) {
      let matchingScore = 0;
      let numFailedConditions = 0;

      const { rating, salary, userLanguage, careExp, cookExp, address } = filters;
      const averageRating = calculateAverageRating(employee);

      if (rating !== undefined) {
        const hasMatchingRating = averageRating >= rating;
        if (hasMatchingRating) {
          matchingScore += 1.75;
        } else {
          numFailedConditions += 1;
        }
      }

      if (userLanguage !== undefined) {
        const userLanguageName = await Language.find({ _id: { $in: employee.userLanguage } }).distinct('name');
        const isMatchingLanguage = userLanguageName.includes(userLanguage);
        if (isMatchingLanguage) {
          matchingScore += 2;
        } else {
          numFailedConditions += 1;
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
        if (employee.careExp === careExp) {
          matchingScore += 1.25;
        } else {
          numFailedConditions += 1;
        }
      }

      if (cookExp !== undefined) {
        if (employee.cookExp === cookExp) {
          matchingScore += 1.25;
        } else {
          numFailedConditions += 1;
        }
      }

      return { matchingScore, numFailedConditions };
    }

    async function searchEmployees(filters) {
      const matchingPromises = employees.map((employee) => calculateMatchingScore(employee, filters));
      const matchingResults = await Promise.all(matchingPromises);

      const matchedEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const { matchingScore, numFailedConditions } = matchingResults[i];
        if (numFailedConditions < 1) {
          const userLanguageName = await Language.find({ _id: { $in: employee.userLanguage } }).distinct('name');
          const employeeWithuserLanguageName = { ...employee._doc, userLanguageName };
          matchedEmployees.push(employeeWithuserLanguageName);
        }
      }

      return matchedEmployees.sort((a, b) => {
        const scoreA = calculateMatchingScore(a, filters);
        const scoreB = calculateMatchingScore(b, filters);
        return scoreB - scoreA;
      });
    }

    async function searchFailEmployees(filters) {
      const matchingPromises = employees.map((employee) => calculateMatchingScore(employee, filters));
      const matchingResults = await Promise.all(matchingPromises);

      const matchedEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const { matchingScore, numFailedConditions } = matchingResults[i];
        if (numFailedConditions > 0) {
          const userLanguageName = await Language.find({ _id: { $in: employee.userLanguage } }).distinct('name');
          const employeeWithuserLanguageName = { ...employee._doc, userLanguageName };
          matchedEmployees.push(employeeWithuserLanguageName);
        }
      }

      matchedEmployees.sort((a, b) => {
        const scoreA = calculateMatchingScore(a, filters);
        const scoreB = calculateMatchingScore(b, filters);
        return scoreB - scoreA;
      });
      const output = matchedEmployees.slice(0, 3);
      return output;
    }

    let matchedStaffs = await searchEmployees(filters);

    if (matchedStaffs.length === 0) {
      matchedStaffs = await searchFailEmployees(filters);
    }

    return matchedStaffs;
  } catch (error) {
    throw error;
  }
};

module.exports = { searchStaff };
