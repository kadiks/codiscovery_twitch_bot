const moment = require("moment");

/**
 *
 * @param {Object} params
 *  @param {String} [params.period=day]
 */
const getStartingDateByPeriod = ({ period = "day" }) => {
  const d = new Date();

  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();

  const startingDate = moment(new Date(year, month, day))
    .subtract(1, period)
    .toDate();

  return startingDate;
};

module.exports = {
  getStartingDateByPeriod,
};
