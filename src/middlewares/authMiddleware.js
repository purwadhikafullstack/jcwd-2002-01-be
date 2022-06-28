const { adminVerifySession } = require("../lib/session");

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

module.exports = {
  AuthorizeLoggedInAdmin,
};
