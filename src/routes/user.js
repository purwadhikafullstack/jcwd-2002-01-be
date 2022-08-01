const { userController } = require("../controllers");
const fileUploader = require("../lib/uploader");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.patch("/", userController.editProfile);

router.patch(
  "/profile-picture/:id",
  fileUploader({
    destinationFolder: "profile-image",
    fileType: "image",
    prefix: "POST",
  }).single("profile_image_file"),
  userController.editAvatar
);

router.post("/address", AuthorizeLoggedInUser, userController.addNewAddress);
router.get("/address", AuthorizeLoggedInUser, userController.getAllAddress);
router.get(
  "/transaction",
  AuthorizeLoggedInUser,
  userController.getAllUserTransaction
);
router.get(
  "/main-address",
  AuthorizeLoggedInUser,
  userController.getMainAddress
);

module.exports = router;
