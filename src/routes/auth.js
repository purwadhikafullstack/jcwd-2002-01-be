const { authController } = require("../controllers");
const { AuthorizeLoggedInAdmin } = require("../middlewares/authMiddleware");
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

router.get(
  "/admin/refresh-token",
  AuthorizeLoggedInAdmin,
  authController.adminKeepLogin
);

module.exports = router;
