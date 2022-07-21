const { transactionController } = require("../controllers");
const { AuthorizeLoggedInAdmin, AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");
const fileUploader = require("../lib/uploader")

const router = require("express").Router();

router.get("/", transactionController.getAllTransaction);
router.patch(
  "/:transactionId",
  AuthorizeLoggedInAdmin,
  transactionController.acceptOrder
);
router.post(
  "/",
  fileUploader({
    destinationFolder: "prescription-image",
    fileType: "image",
    prefix: "POST",
  }).single("prescription_image_file"),
  AuthorizeLoggedInUser,
  transactionController.uploadPrescription
);

module.exports = router;
