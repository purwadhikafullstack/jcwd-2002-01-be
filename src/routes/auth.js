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

router.get("/verify/:token", authController.verifyUser);

module.exports = router;
