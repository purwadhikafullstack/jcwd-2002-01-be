const CartService = require("../services/cart");

const cartController = {
  getAllCartItems: async (req, res) => {
    try {
      const serviceResult = await CartService.getAllCartItems(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  addToCart: async (req, res) => {
    try {
      const user_id = req.token.user_id;
      const { product_id, quantity, type } = req.body;
      const serviceResult = await CartService.addToCart(
        product_id,
        user_id,
        quantity,
        type
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  removeItemfromCart: async (req, res) => {
    try {
      const user_id = req.token.user_id;
      const { product_id } = req.params;

      const serviceResult = await CartService.removeFromCart(
        user_id,
        product_id
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  getSelectedCart: async (req, res) => {
    try {
      const { cart_id } = req.body;
      const user_id = req.token.user_id;

      const serviceResult = await CartService.selectedCart(cart_id, user_id);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  checkoutCart: async (req, res) => {
    try {
      const { cart_id, total_price } = req.body;
      const user_id = req.token.user_id;

      const serviceResult = await CartService.checkoutCart(
        cart_id,
        user_id,
        total_price
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  getCheckoutCart: async (req, res) => {
    try {
      const user_id = req.token.user_id;
      const serviceResult = await CartService.getAllCheckedOut(user_id);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = cartController;
