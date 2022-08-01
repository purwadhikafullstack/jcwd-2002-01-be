const { userController } = require("../controllers");
const fileUploader = require("../lib/uploader");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.patch("/", AuthorizeLoggedInUser, userController.editProfile);

router.patch(
  "/profile-picture",
  fileUploader({
    destinationFolder: "profile-image",
    fileType: "image",
    prefix: "PATCH",
  }).single("profile_image_file"),
  AuthorizeLoggedInUser,
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
