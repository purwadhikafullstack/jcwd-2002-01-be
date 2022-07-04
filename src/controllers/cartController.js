const CartService = require("../services/auth");

const cartController = {
  getAllCartItems: async (req, res) => {
    try {
      const serviceResult = await CartService.getAllItems(req);

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


module.exports = cartController