const {
  TransactionItem,
  Transaction,
  User,
  Address,
  Product,
  ProductImage,
  StockOpname,
  Inventory,
} = require("../../lib/sequelize");
const Service = require("../service");

class Transactions extends Service {
  static getAllTransactionByStatus = async (req) => {
    try {
      const { status_transaction, _limit = 30, _page = 1 } = req.query;

      delete req.query.status_transaction;
      delete req.query._limit;
      delete req.query._page;

      const whereStatusClause = {};

      if (status_transaction) {
        whereStatusClause.status_transaction = status_transaction;
      }

      const getAllTransaction = await Transaction.findAndCountAll({
        where: {
          ...whereStatusClause,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
            include: [
              {
                model: Address,
              },
            ],
          },
          {
            model: TransactionItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: ProductImage,
                    attributes: ["image_url"],
                  },
                  {
                    model: StockOpname,
                    attributes: ["amount"],
                  },
                ],
              },
            ],
          },
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        distinct: true,
      });
      return this.handleSuccess({
        message: "Transaction Found",
        statusCode: 200,
        data: getAllTransaction,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Can't Reach Transaction",
        statusCode: 500,
      });
    }
  };

  static acceptOrder = async (req) => {
    try {
      const { transactionId } = req.params;
      const { status_transaction } = req.body;
      const { token } = req;

      await Transaction.update(
        {
          status_transaction,
        },
        {
          where: { id: transactionId },
        }
      );

      if (status_transaction === "ready delivery") {
        const findProduct = await TransactionItem.findAll({
          where: {
            transaction_id: transactionId,
          },
          include: [
            {
              model: Product,
              include: {
                model: StockOpname,
                attributes: ["amount", "product_id"],
              },
            },
          ],
        });

        findProduct.forEach(async (val) => {
          await StockOpname.update(
            {
              amount:
                val.dataValues.Product.Stock_opnames[0].amount -
                val.dataValues.quantity,
            },
            {
              where: {
                product_id: val.dataValues.Product.Stock_opnames[0].product_id,
              },
            }
          );

          const findInventory = await Inventory.findOne({
            where: {
              product_id: val.dataValues.Product.Stock_opnames[0].product_id,
            },
          });

          await Inventory.create({
            quantity: val.dataValues.quantity,
            expired_date: findInventory.dataValues.expired_date,
            type: "sold",
            product_id: val.dataValues.Product.Stock_opnames[0].product_id,
            admin_id: token.admin_id,
          });
        });
      }

      return this.handleSuccess({
        message: "Accepted order",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = Transactions;
