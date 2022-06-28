const { Op } = require("sequelize");
const { AdminLoginSession } = require("./sequelize");
const moment = require("moment");

const adminVerifySession = async (token) => {
  const findSession = await AdminLoginSession.findOne({
    where: {
      token,
      is_valid: true,
      valid_until: {
        [Op.gt]: moment().utc(),
      },
    },
  });

  return findSession;
};

module.exports = {
  adminVerifySession,
};
