const axiosInstance = require("../../lib/rajaOngkirInstance");
const Service = require("../service");

class AddressService extends Service {
  static getProvince = async (req) => {
    try {
      const province = await axiosInstance.get("/province");

      console.log(province);

      return this.handleSuccess({
        message: "get province",
        statusCode: 200,
        data: province.data.rajaongkir.results,
      });
    } catch (err) {
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
  static getCity = async (req) => {
    try {
      const { province_id } = req.params;
      const city = await axiosInstance.get(`/city?province=${province_id}`);

      return this.handleSuccess({
        message: "get province",
        statusCode: 200,
        data: city.data.rajaongkir.results,
      });
    } catch (err) {
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
  static getOngkir = async (req) => {
    try {
      const { product_id } = req.body;
    } catch (err) {
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = AddressService;
