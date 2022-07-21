const { Op } = require("sequelize");
const {
  Cart,
  Product,
  Inventory,
  ProductImage,
  Transaction,
  TransactionItem,
} = require("../../lib/sequelize");
const moment = require("moment");
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
  static selectedCart = async (cart_id = [], user_id) => {
    try {
      const findCart = await Cart.findAll({
        where: {
          id: {
            [Op.in]: cart_id,
          },
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
        message: "get selected cart",
        statusCode: 200,
        data: findCart,
      });
    } catch (err) {
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
  static checkoutCart = async (cart_id = [], user_id, total_price) => {
    try {
      const makeTransaction = await Transaction.create({
        total_price,
        status_transaction: "pending",
        valid_until: moment().add(1, "day"),
        user_id,
      });

      const findCart = await Cart.findAll({
        where: {
          id: {
            [Op.in]: cart_id,
          },
          user_id,
        },
        include: [
          {
            model: Product,
            attributes: ["price"],
          },
        ],
      });

      const cartDetail = findCart.map((val) => {
        return {
          product_id: val.dataValues.product_id,
          quantity: val.dataValues.quantity,
          price: val.dataValues.Product.price,
          transaction_id: makeTransaction.id,
        };
      });

      const newTransaction = await TransactionItem.bulkCreate(cartDetail);

      await Cart.destroy({
        where: {
          id: cart_id,
          user_id,
        },
      });

      return this.handleSuccess({
        message: "checkout cart",
        statusCode: 200,
        data: newTransaction,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static getAllCheckedOut = async (user_id) => {
    try {
      const findTransaction = await Transaction.findAll({
        where: {
          status_transaction: "pending",
          user_id,
        },
        include: [
          {
            model: TransactionItem,
            include: [{ model: Product, include: [ProductImage] }],
          },
        ],
      });

      return this.handleSuccess({
        message: "get transaction",
        statusCode: 200,
        data: findTransaction,
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
