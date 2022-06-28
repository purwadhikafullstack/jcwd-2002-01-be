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

router.post(
  "/admin-register",
  rulesValidation,
  runValidator,
  authController.adminRegister
);

router.post("/admin-login", authController.adminLogin);

module.exports = router;
