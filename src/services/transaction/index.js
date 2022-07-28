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
const fs = require("fs");
const { Op } = require("sequelize");

class Transactions extends Service {
  static getAllTransactionByStatus = async (req) => {
    try {
      const {
        status_transaction,
        _limit = 30,
        _page = 1,
        _sortBy = "",
        _sortDir = "",
        username,
        id,
        date = [],
      } = req.query;

      delete req.query.status_transaction;
      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.username;
      delete req.query.date;

      const whereStatusClause = {};
      const whereUsername = {};
      const whereDate = {};

      if (status_transaction || id) {
        if (status_transaction) {
          whereStatusClause.status_transaction = status_transaction;
        }
        if (id) {
          whereStatusClause.id = id;
        }
      }

      if (username) {
        whereUsername.username = {
          [Op.like]: `%${username}%`,
        };
      }

      if (date.length && !(date[0] === "" && date[0] === "")) {
        whereDate.createdAt = {
          [Op.between]: date,
        };
      }

      const getAllTransaction = await Transaction.findAndCountAll({
        where: {
          ...whereDate,
          ...whereStatusClause,
        },
        include: [
          {
            model: User,
            where: {
              ...whereUsername,
            },
            attributes: ["username"],
            required: true,
          },
          {
            model: Address,
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
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
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

      if (status_transaction === "canceled") {
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
                val.dataValues.Product.Stock_opnames[0].amount +
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
      } else if (status_transaction === "success") {
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

      await Transaction.update(
        {
          status_transaction,
        },
        {
          where: { id: transactionId },
        }
      );

      return this.handleSuccess({
        message: "Accepted order",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
    }
  };
  static uploadPrescription = async (req) => {
    try {
      const user_id = req.token.user_id;
      const filename = req.file.filename;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "payment_images";

      const prescription = await Transaction.create({
        recipe_image: req.file
          ? `${uploadFileDomain}/${filePath}/${filename}`
          : undefined,
        user_id,
        status_transaction: "pending",
      });

      return this.handleSuccess({
        message: "upload prescription",
        statusCode: 200,
        data: prescription,
      });
    } catch (err) {
      console.log(err);

      fs.unlinkSync(
        __dirname + "/../public/proof-of-payment/" + req.file.filename
      );

      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = Transactions;
