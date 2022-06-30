const { Op } = require("sequelize");
const { AdminLoginSession, UserLoginSession } = require("./sequelize");
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

const UserVerifySession = async (token) => {
  const findSession = await UserLoginSession.findOne({
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
  UserVerifySession,
};
