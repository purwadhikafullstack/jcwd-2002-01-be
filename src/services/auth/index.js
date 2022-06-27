const Service = require("../service");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../../lib/mailer");
const { User, VerificationToken } = require("../../lib/sequelize");
const mustache = require("mustache");

class authService extends Service {
  static register = async (req) => {
    try {
      const { username, email, password } = req.body;

      const isUsernameEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameEmailTaken) {
        return this.handleError({
          message: "Username and Email has been taken",
          statusCode: 400,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const verificationToken = nanoid(25);

      await VerificationToken.create({
        token: verificationToken,
        user_id: newUser.id,
        valid_until: moment().add(1, "hour"),
        is_valid: true,
      });

      const verificationLink = `http://localhost:2000/auth/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
      });

      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "Registered User",
        statusCode: 201,
        data: newUser,
      });
    } catch (err) {
      console.log(err);

      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static VerifyUser = async (req) => {
    try {
      const { token } = req.params;

      const findToken = await VerificationToken.findOne({
        where: {
          token,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!findToken) {
        return this.handleError({
          message: "Your token is invalid",
          statusCode: 400,
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: findToken.user_id,
          },
        }
      );

      findToken.is_valid = false;
      findToken.save();

      return this.handleRedirect({
        link: `http://localhost:3000/verification_page`,
      });
    } catch (err) {
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
}
module.exports = authService;
