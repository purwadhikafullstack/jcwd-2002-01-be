const { Cart } = require("../../lib/sequelize");
const Service = require("../service");

class CartService extends Service {
  static getAllCartItems = async (req) => {
    try {
      const { userId } = req.token.id;
      const { productId } = req.body;

      const findAllCartItems = await Cart.findAndCountAll({
        where: {
            user_id : userId,
            productId : productId
        }
      });

      return this.handleSuccess({
        message: "get all cart items",
        statusCode: 200,
        data: findAllCartItems,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = CartService;
