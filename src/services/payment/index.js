const { Op } = require("sequelize");
const { Payment, Transaction } = require("../../lib/sequelize");
const fs = require("fs")
const Service = require("../service");
const moment = require("moment");

class PaymentService extends Service {
  static uploadProofOfPayment = async (req) => {
    try {
      const user_id = req.token.user_id;
      const filename = req.file.filename;
      const { method } = req.body;

      const findTransaction = await Transaction.findOne({
        where: {
          status_transaction: "pending",
          user_id,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });
      if (!findTransaction) {
        return this.handleError({
          message: "cannot find any transaction",
          statusCode: 400,
        });
      }

      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "payment_images";

      const payment = await Payment.create({
        payment_image: req.file
          ? `${uploadFileDomain}/${filePath}/${filename}`
          : undefined,
        amount: findTransaction.dataValues.total_price,
        method,
        transaction_id: findTransaction.id,
      });

      findTransaction.status_transaction = "waiting for confirmation"
      findTransaction.save()

      return this.handleSuccess({
        message: "add payment",
        statusCode: 200,
        data: payment,
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

module.exports = PaymentService;
