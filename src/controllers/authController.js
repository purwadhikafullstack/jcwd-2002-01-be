const authService = require("../services/auth");

const authController = {
  register: async (req, res) => {
    try {
      console.log("test");
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

  verifyUser: async (req, res) => {
    try {
      const serviceResult = await authService.verifyUser(req);

      if (!serviceResult.success) throw serviceResult;

      return res.redirect(serviceResult.link);
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      const serviceResult = await authService.userLogin(req);
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

  UserKeepLogin: async (req, res) => {
    try {
      const serviceResult = await authService.userKeepLogin(req);

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

  adminRegister: async (req, res) => {
    try {
      const serviceResult = await authService.adminRegister(req);

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

  adminLogin: async (req, res) => {
    try {
      const serviceResult = await authService.adminLogin(req);

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

  adminKeepLogin: async (req, res) => {
    try {
      const serviceResult = await authService.adminKeepLogin(req);

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

  changePassword: async (req, res) => {
    try {
      console.log(req.body);

      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      console.log(oldPassword);
      console.log(newPassword);

      const serviceResult = await authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const serviceResult = await authService.forgotPassword(email);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { newPassword } = req.body;
      const { token } = req.params;

      const serviceResult = await authService.resetPassword(newPassword, token);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = authController;
