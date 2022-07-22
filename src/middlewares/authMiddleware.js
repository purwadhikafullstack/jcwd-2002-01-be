const { UserLoginSession } = require("../lib/sequelize");
const { adminVerifySession, UserVerifySession } = require("../lib/session");

const AuthorizeLoggedInAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const verifiedToken = await adminVerifySession(token);

    if (!verifiedToken) throw new Error("Session invalid/expired");

    req.token = verifiedToken.dataValues;

    next();
  } catch (err) {
    console.log(err);
    return res.status(419).json({
      message: err.message,
    });
  }
};

const AuthorizeLoggedInUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const validateToken = await UserLoginSession.findOne({
      where: { token, is_Valid: true },
    });

    const verifiedToken = await UserVerifySession(token);

    if (!verifiedToken) throw new Error("Session invalid/expired");

    req.token = verifiedToken.dataValues;
    req.user = { id: validateToken.user_id };

    next();
  } catch (err) {
    console.log(err);
    return res.status(419).json({
      message: err.message,
    });
  }
};

module.exports = {
  AuthorizeLoggedInAdmin,
  AuthorizeLoggedInUser,
};
