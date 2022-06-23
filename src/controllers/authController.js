const authService = require("../services/auth");

const authController = {
  register: async (req, res) => {
    try {
      const serviceResult = await authService.register(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 201).json({
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

module.exports = authController;
