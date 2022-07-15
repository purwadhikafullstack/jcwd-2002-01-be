const  paymentController  = require("../controllers/paymentController");
const fileUploader = require("../lib/uploader");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post(
  "/",
  fileUploader({
    destinationFolder: "proof-of-payment",
    fileType: "image",
    prefix: "POST",
  }).single("payment_image_file"),
  AuthorizeLoggedInUser,
  paymentController.uploadProofOfPayment
);

module.exports = router;
