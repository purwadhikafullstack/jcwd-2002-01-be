const {
  Cart,
  Product,
  Inventory,
  ProductImage,
} = require("../../lib/sequelize");
const Service = require("../service");

class CartService extends Service {
  static getAllCartItems = async (req) => {
    try {
      const { user_id } = req.token;
      const findAllCartItems = await Cart.findAndCountAll({
        where: {
          user_id,
        },
        include: [
          {
            model: Product,
            include: [{ model: ProductImage }],
          },
        ],
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

  static addToCart = async (product_id, user_id, quantity = 1, type) => {
    try {
      const findProductInCart = await Cart.findOne({
        where: {
          product_id,
          user_id,
        },
        include: [
          {
            model: Product,
            include: [{ model: ProductImage }],
          },
        ],
      });

      if (findProductInCart) {
        await Cart.update(
          {
            quantity: quantity,
          },
          {
            where: {
              product_id: findProductInCart.product_id,
            },
          }
        );

          
        const findAllCartItems = await Cart.findAndCountAll({
          where: {
            user_id,
          },
          include: [
            {
              model: Product,
              include: [{ model: ProductImage }],
            },
          ],
        });

        return this.handleSuccess({
          message: `add the same product with id ${product_id} to cart success`,
          statusCode: 201,
          data: findAllCartItems,
        });
      }

      // this.getAllCartItems()

      await Cart.create({
        user_id,
        product_id,
        quantity,
      });

      const findAllCartItems = await Cart.findAndCountAll({
        where: {
          user_id,
        },
        include: [
          {
            model: Product,
            include: [{ model: ProductImage }],
          },
        ],
      });

      return this.handleSuccess({
        message: "add to cart success",
        statusCode: 201,
        data: findAllCartItems,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static removeFromCart = async (user_id, product_id) => {
    try {
      const removeItemFromCart = await Cart.destroy({
        where: {
          user_id,
          product_id,
        },
      });

      console.log(product_id, user_id);

      return this.handleSuccess({
        message: "item removed",
        statusCode: 200,
        data: removeItemFromCart,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = CartService;
