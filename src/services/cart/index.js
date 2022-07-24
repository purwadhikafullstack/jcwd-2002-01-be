const { Op } = require("sequelize");
const {
  Cart,
  Product,
  Inventory,
  ProductImage,
  Transaction,
  TransactionItem,
  StockOpname,
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
            include: [
              {
                model: ProductImage,
              },
              {
                model: StockOpname,
                attributes: ["amount", "product_id"],
              },
            ],
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
              include: [
                {
                  model: ProductImage,
                },
                {
                  model: StockOpname,
                  attributes: ["amount", "product_id"],
                },
              ],
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
            include: [
              {
                model: ProductImage,
              },
              {
                model: StockOpname,
                attributes: ["amount", "product_id"],
              },
            ],
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
  static checkoutCart = async (
    cart_id = [],
    user_id,
    total_price,
    addressId
  ) => {
    try {
      const findTransaction = await Transaction.findAll({
        where: {
          user_id,
          status_transaction: "pending"
        }
      })  

      if(findTransaction.length == 1){
        return this.handleError({
          message: "tidak bisa melakukan lebih dari 2 transaksi",
          statusCode: 400
        })
      }

      const makeTransaction = await Transaction.create({
        total_price,
        status_transaction: "pending",
        valid_until: moment().add(1, "day"),
        user_id,
        AddressId: addressId,
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
            include: [
              {
                model: StockOpname,
                attributes: ["amount", "product_id"],
              },
            ],
          },
        ],
      });

      let cartDetail = [];

      for (let i = 0; i < findCart.length; i++) {
        let cart = {};
        const stock =
          findCart[i].dataValues.Product.dataValues.Stock_opnames[0].dataValues
            .amount;
        const quantity = findCart[i].dataValues.quantity;

        if (quantity > stock) {
          return this.handleError({
            message: "quantity melebihi stock",
            statusCode: 500,
          });
        }

        cart = {
          product_id: findCart[i].dataValues.product_id,
          quantity: findCart[i].dataValues.quantity,
          price: findCart[i].dataValues.Product.price,
          transaction_id: makeTransaction.id,
        };

        cartDetail.push(cart);
      }

      const newTransaction = await TransactionItem.bulkCreate(cartDetail);

      findCart.forEach(async (val) => {
        await StockOpname.update(
          {
            amount:
              val.dataValues.Product.dataValues.Stock_opnames[0].dataValues
                .amount - val.dataValues.quantity,
          },
          {
            where: {
              product_id: val.dataValues.product_id,
            },
          }
        );
      });

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
