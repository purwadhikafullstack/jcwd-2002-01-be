const fs = require("fs");
const { User, Address } = require("../../lib/sequelize");
const Service = require("../service");

class UserService extends Service {
  static editProfile = async (req) => {
    try {
      const { full_name, gender, email, age, id } = req.body;

      const findUser = await User.findByPk(id);


      const newUserData = await User.update(
        {
          full_name,
          gender,
          email,
          age,
        },
        {
          where: { id: findUser.id },
        }
      );

      return this.handleSuccess({
        message: "user edited",
        statusCode: 200,
        data: newUserData,
      });
    } catch (err) {
      console.log(err);

      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static changeProfilePicture = async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await User.findByPk(id)


      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "profile_images";
      const filename = req.file?.filename;

      const newUserData = await User.update(
        {
          profile_image: req.file
            ? `${uploadFileDomain}/${filePath}/${filename}`
            : undefined,
        },
        {
          where: { id: findUser.id },
        }
      );

      return this.handleSuccess({
        message: "user edited",
        statusCode: 200,
        data: newUserData,
      });

    } catch (err) {
      console.log(err);

      fs.unlinkSync(
        __dirname + "/../public/profile-image/" + req.file.filename
      );

      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static addAddress = async (req) => {
    try {
      const {
        address,
        recipient_name,
        recipient_telephone,
        province,
        city,
        kecamatan,
        postal_code,
        is_main_address,
        id,
      } = req.body;

      const findUser = await User.findByPk(id);

      await Address.create(
        {
          address,
          recipient_name,
          recipient_telephone,
          kecamatan,
          province,
          city,
          postal_code,
          is_main_address,
        },
        {
          where: { id: findUser.id },
        }
      );

      return this.handleSuccess({
        message: "address succesfuly added",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static editAddress = async (req, res) => {
    try {
      const {
        address,
        recipient_name,
        recipient_telephone,
        province,
        city,
        kecamatan,
        postal_code,
        is_main_address,
        id,
      } = req.body;

      const findUser = await User.findByPk(id);

      const editAddress = await Address.update(
        {
          address,
          recipient_name,
          recipient_telephone,
          province,
          city,
          kecamatan,
          postal_code,
          is_main_address,
        },
        {
          where: { id: findUser.id },
        }
      );

      return this.handleSuccess({
        message: "address edited",
        statusCode: 200,
        data: editAddress,
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

module.exports = UserService;
