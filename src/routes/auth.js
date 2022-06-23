const { authController } = require("../controllers");
const {
  runValidator,
  rulesValidation,
} = require("../validation/registerValidation");
const router = require("express").Router();

router.post(
  "/register",
  rulesValidation,
  runValidator,
  authController.register
);

module.exports = router;
