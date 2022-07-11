const fs = require("fs");
const axiosInstance = require("../../lib/rajaOngkirInstance");
const {
  User,
  Address,
  Transaction,
  TransactionItem,
  Product,
  ProductImage,
} = require("../../lib/sequelize");
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

      const findUser = await User.findByPk(id);

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
        address_label,
      } = req.body;
      const user_id = req.token.user_id;

      if (is_main_address) {
        const findAddress = await Address.update(
          {
            is_main_address: false,
          },
          {
            where: {
              is_main_address: true,
              user_id,
            },
          }
        );
      }

      const getProvince = await axiosInstance.get(`/province?id=${province}`);
      const getCity = await axiosInstance.get(`/city?id=${city}`);

      const provinceName = getProvince.data.rajaongkir.results.province;

      const cityName = getCity.data.rajaongkir.results.city_name;

      const newAddress = await Address.create({
        address,
        recipient_name,
        recipient_telephone,
        kecamatan,
        province: provinceName,
        city: cityName,
        postal_code,
        is_main_address,
        address_label,
        user_id,
      });

      return this.handleSuccess({
        message: "address succesfuly added",
        statusCode: 201,
        data: newAddress,
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
        address_label,
      } = req.body;
      const user_id = req.token.user_id;

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
          address_label,
        },
        {
          where: { user_id },
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
  static getAddress = async (req) => {
    try {
      const user_id = req.token.user_id;

      const findAddress = await Address.findAll({
        where: {
          user_id,
        },
      });

      if (!findAddress) {
        return this.handleError({
          message: "address not found",
          statusCode: 400,
        });
      }

      return this.handleSuccess({
        message: "get all address",
        statusCode: 200,
        data: findAddress,
      });
    } catch (err) {
      this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
  static getMainAddress = async (user_id) => {
    try {
      const findMainAddress = await Address.findOne({
        where: {
          is_main_address: true,
          user_id,
        },
      });

      return this.handleSuccess({
        message: "get main address",
        statusCode: 200,
        data: findMainAddress,
      });
    } catch (err) {
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static getAllUserTransaction = async (query, user_id) => {
    try {
      const {
        _limit = 30,
        _page = 1,
        _sortBy = "",
        _sortDir = "",
        selected_status,
      } = query;

      delete query._limit;
      delete query._page;
      delete query._sortBy;
      delete query._sortDir;
      delete query.selected_status;

      const statusClause = {};

      if (selected_status) {
        statusClause.status_transaction = selected_status;
      }

      const findTransaction = await Transaction.findAndCountAll({
        where: {
          ...query,
          ...statusClause,
          user_id,
        },
        include: [
          {
            model: TransactionItem,
            include: [
              {
                model: Product,
                include: {
                  model: ProductImage,
                },
              },
            ],
          },
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      if (!findTransaction) {
        return this.handleError({
          message: "No transaction found",
          statusCode: 500,
        });
      }
      return this.handleSuccess({
        message: "Transactions found",
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

module.exports = UserService;
