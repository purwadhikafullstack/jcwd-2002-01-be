const { authController } = require("../controllers");
const {
  AuthorizeLoggedInAdmin,
  AuthorizeLoggedInUser,
} = require("../middlewares/authMiddleware");
const authService = require("../services/auth");
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

router.post("/user-login", authController.userLogin);

router.post("/admin-login", authController.adminLogin);

router.get(
  "/admin/refresh-token",
  AuthorizeLoggedInAdmin,
  authController.adminKeepLogin
);

router.get(
  "/user/refresh-token",
  AuthorizeLoggedInUser,
  authController.UserKeepLogin
);

// router.post("/forgot-password", authController.sendResetPasswordEmail);
router.post(
  "/change-password",
  AuthorizeLoggedInUser,
  authController.changePassword
);

module.exports = router;
