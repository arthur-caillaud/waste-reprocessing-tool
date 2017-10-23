var utilities = {};

// returns the first and last date of the selected month
// year and month are to be given as numbers
function computeDates(year, month, siteId, callback, arg) {

    // throw and error if invalid date provided
    if (month%1!=0 || year%1!=0 || month<1 || month>12) {
        throw "Invalid date format \n expected yyyy, mm (example 2017, 03)";
    }

    if (month==12) {
        var endYear = year + 1;
        var endMonth = 1;
    }
    else {
        var endYear = year;
        var endMonth = month + 1;
    }

    if (month<10) {
        month = "0" + month;
    }
    if (endMonth<10) {
        endMonth = "0" + endMonth;
    }

    const beginDate = year + '-' + month + '-01';
    const endDate = endYear + '-' + endMonth + '-01';

    return callback(beginDate, endDate, siteId, arg);
}

utilities.computeDates = computeDates;

module.exports = utilities;
