const { check, validationResult } = require("express-validator");

exports.runValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      status: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

exports.rulesValidation = [
  check("username").notEmpty().withMessage("username is required"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email has been email format"),
  check("password")
    .notEmpty()
    .withMessage("password must be required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    ),
];
