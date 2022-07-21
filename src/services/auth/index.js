const Service = require("../service");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../../lib/mailer");
const {
  User,
  VerificationToken,
  Admin,
  AdminLoginSession,
  UserLoginSession,
  ForgotPasswordToken,
} = require("../../lib/sequelize");
const mustache = require("mustache");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

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

  static verifyUser = async (req) => {
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

  static userLogin = async (req) => {
    try {
      const { credential, password } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username: credential }, { email: credential }],
        },
      });

      if (!findUser) {
        return this.handleError({
          message: "Wrong username or password",
          statusCode: 400,
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

      if (!isPasswordCorrect) {
        return this.handleError({
          message: "wrong username or password",
          statusCode: 400,
        });
      }

      delete findUser.dataValues.password;

      await UserLoginSession.update(
        {
          is_valid: false,
        },
        {
          where: {
            user_id: findUser.id,
            is_valid: true,
          },
        }
      );

      const sessionToken = nanoid(64);

      await UserLoginSession.create({
        user_id: findUser.id,
        is_valid: true,
        token: sessionToken,
        valid_until: moment().add(1, "day"),
      });

      return this.handleSuccess({
        message: "Logged in user",
        statusCode: 200,
        data: {
          user: findUser,
          token: sessionToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static userKeepLogin = async (req) => {
    try {
      const { token } = req;

      const renewedToken = nanoid(64);

      const findUser = await User.findByPk(token.user_id);

      delete findUser.dataValues.password;

      await UserLoginSession.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );
      return this.handleSuccess({
        message: "Renewed user token",
        statusCode: 200,
        data: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static adminRegister = async (req) => {
    try {
      const { username, email, password } = req.body;

      const checkEmailUser = await User.findOne({
        where: {
          email,
        },
      });

      if (checkEmailUser) {
        return this.handleError({
          message:
            "This email has been registered as user account, email used by the user cannot be used by the admin",
          statusCode: 400,
        });
      }

      const checkEmailAdmin = await Admin.findOne({
        where: {
          email,
        },
      });

      if (checkEmailAdmin) {
        return this.handleError({
          message:
            "This email has been registered, if you forget your password, you can reset your password",
          statusCode: 400,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const newAdmin = await Admin.create({
        username,
        email,
        password: hashedPassword,
        role: "admin",
      });

      return this.handleSuccess({
        message: "your account was created successfully",
        statusCode: 201,
        data: newAdmin,
      });
    } catch (err) {
      console.log(err);

      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static adminLogin = async (req) => {
    try {
      const { credential, password } = req.body;

      const findAdmin = await Admin.findOne({
        where: {
          [Op.or]: [{ username: credential }, { email: credential }],
        },
      });

      if (!findAdmin) {
        return this.handleError({
          message: "Wrong username or password",
          statusCode: 400,
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        findAdmin.password
      );

      if (!isPasswordCorrect) {
        return this.handleError({
          message: "wrong username or password",
          statusCode: 400,
        });
      }

      delete findAdmin.dataValues.password;

      await AdminLoginSession.update(
        {
          is_valid: false,
        },
        {
          where: {
            admin_id: findAdmin.id,
            is_valid: true,
          },
        }
      );

      const sessionToken = nanoid(64);

      await AdminLoginSession.create({
        admin_id: findAdmin.id,
        is_valid: true,
        token: sessionToken,
        valid_until: moment().add(1, "day"),
      });

      return this.handleSuccess({
        message: "Logged in user",
        statusCode: 200,
        data: {
          user: findAdmin,
          token: sessionToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static adminKeepLogin = async (req) => {
    try {
      const { token } = req;

      const renewedToken = nanoid(64);

      const findAdmin = await Admin.findByPk(token.admin_id);

      delete findAdmin.dataValues.password;

      await AdminLoginSession.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return this.handleSuccess({
        message: "Renewed user token",
        statusCode: 200,
        data: {
          user: findAdmin,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static forgotPassword = async (email) => {
    try {
      console.log(email);

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      const passwordToken = nanoid(40);

      await ForgotPasswordToken.update(
        { is_valid: false },
        {
          where: {
            user_id: findUser.id,
            is_valid: true,
          },
        }
      );

      await ForgotPasswordToken.create({
        token: passwordToken,
        valid_until: moment().add(1, "hour"),
        is_valid: true,
        user_id: findUser.id,
      });

      const forgotPasswordLink = `http://localhost:3000/change-forgot-password/${passwordToken}`;

      const template = fs
        .readFileSync(__dirname + "/../../templates/forgot-template.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        name: findUser.name,
        forgot_password_url: forgotPasswordLink,
      });

      await mailer({
        to: findUser.email,
        subject: "Forgot password!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "Your forgot password request was sent",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);

      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
  static changePassword = async (user_id, oldPassword, newPassword) => {
    try {
      const findUser = await User.findByPk(user_id);

      // console.log(oldPassword);

      if (!findUser) {
        return this.handleError({
          message: "User not found!",
          statusCode: 400,
        });
      }

      const comparePassword = bcrypt.compareSync(
        oldPassword,
        findUser.password
      );

      console.log(comparePassword);

      if (!comparePassword) {
        return this.handleError({
          message: "Change password failed, your current password is wrong!",
          statusCode: 400,
        });
      }

      const newHashedPassword = bcrypt.hashSync(newPassword, 5);

      await User.update(
        { password: newHashedPassword },
        {
          where: {
            id: user_id,
          },
        }
      );

      return this.handleSuccess({
        message: "Password has been changed!",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };
}
module.exports = authService;
