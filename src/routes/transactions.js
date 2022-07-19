const { transactionController } = require("../controllers");

const router = require("express").Router();

router.get("/", transactionController.getAllTransaction);
router.patch("/:transactionId", transactionController.acceptOrder);

module.exports = router;
