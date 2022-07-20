const { transactionController } = require("../controllers");
const { AuthorizeLoggedInAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/", transactionController.getAllTransaction);
router.patch(
  "/:transactionId",
  AuthorizeLoggedInAdmin,
  transactionController.acceptOrder
);

module.exports = router;
