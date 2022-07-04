const cartController = require("../controllers/cartController");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");
const router = require("express").Router()

router.get("/", AuthorizeLoggedInUser, cartController.getAllCartItems)

module.exports = router

