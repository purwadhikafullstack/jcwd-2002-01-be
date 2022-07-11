const cartController = require("../controllers/cartController");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");
const router = require("express").Router()

router.get("/", AuthorizeLoggedInUser, cartController.getAllCartItems)
router.post("/", AuthorizeLoggedInUser, cartController.addToCart)
router.delete("/:product_id", AuthorizeLoggedInUser, cartController.removeItemfromCart)

module.exports = router

