const ProductService = require("../services/product");

const productControllers = {
  getProduct: async (req, res) => {
    try {
      const serviceResult = await ProductService.getProduct(req);

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

  createProduct: async (req, res) => {
    try {
      const serviceResult = await ProductService.createProduct(req);

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

  getAllProductWithQuantity: async (req, res) => {
    try {
      const serviceResult = await ProductService.getAllProductWithQuantity(req);
      if (!serviceResult.success) throw serviceResult;
      return res.status(serviceResult.statusCode || 201).json({
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

  createProductStock: async (req, res) => {
    try {
      const serviceResult = await ProductService.addStockProduct(req);
      if (!serviceResult.success) throw serviceResult;
      return res.status(serviceResult.statusCode || 201).json({
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
  editProduct: async (req, res) => {
    try {
      const serviceResult = await ProductService.editProduct(req);
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

  createProduct: async (req, res) => {
    try {
      const serviceResult = await ProductService.createProduct(req);

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

  deleteProductImage: async (req, res) => {
    try {
      const serviceResult = await ProductService.deleteProductImage(req);
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
  getInventoryByProductId: async (req, res) => {
    try {
      const serviceResult = await ProductService.getStockByProductId(req);

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

module.exports = productControllers;
