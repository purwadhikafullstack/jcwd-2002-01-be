const cartController = require("../controllers/cartController");
const { AuthorizeLoggedInUser } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", AuthorizeLoggedInUser, cartController.getAllCartItems);
router.post(
  "/selected-cart",
  AuthorizeLoggedInUser,
  cartController.getSelectedCart
);
router.post("/checkout", AuthorizeLoggedInUser, cartController.checkoutCart);
router.get(
  "/checkout-items",
  AuthorizeLoggedInUser,
  cartController.getCheckoutCart
);
router.post("/", AuthorizeLoggedInUser, cartController.addToCart);
router.delete(
  "/:product_id",
  AuthorizeLoggedInUser,
  cartController.removeItemfromCart
);

module.exports = router;
