const AddressService = require("../services/address");

const addressController = {
  getProvince: async (req, res) => {
    try {
      const serviceResult = await AddressService.getProvince(req);
      if (!serviceResult.success) throw serviceResult;
      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  getCity: async (req, res) => {
    try {
      const serviceResult = await AddressService.getCity(req);
      if (!serviceResult.success) throw serviceResult;
      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = addressController;
