const { Op } = require("sequelize");
const {
  Product,
  ProductImage,
  Category,
  Inventory,
  StockOpname,
  PurchaseOrder,
  Admin,
} = require("../../lib/sequelize");
const Service = require("../service");
const fs = require("fs");

class ProductService extends Service {
  static getProduct = async (req) => {
    try {
      const { productId } = req.params;

      const getProductData = await Product.findOne({
        include: [
          {
            model: ProductImage,
            attributes: ["image_url"],
          },
        ],
        where: {
          id: productId,
        },
      });

      if (!getProductData) {
        return this.handleError({
          message: `Can't Find Product with ID: ${productId}`,
          statusCode: 404,
        });
      }

      return this.handleSuccess({
        message: "Product Found",
        statusCode: 200,
        data: getProductData,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Can't Reach Product",
        statusCode: 500,
      });
    }
  };

  static getAllProduct = async (req) => {
    try {
      const {
        _limit = 30,
        _page = 1,
        _sortBy = "",
        _sortDir = "",
        name = "",
        selectedCategory,
      } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.name;
      delete req.query.selectedCategory;

      const whereCategoryClause = {};

      if (selectedCategory) {
        whereCategoryClause.CategoryId = selectedCategory;
      }

      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
          categoryId: selectedCategory || undefined,
          name: {
            [Op.like]: `%${name}%`,
          },
          ...whereCategoryClause,
        },
        include: [
          {
            model: ProductImage,
            attributes: ["image_url"],
          },
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      return this.handleSuccess({
        message: "get all products",
        statusCode: 200,
        data: findProducts,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static createProduct = async (req) => {
    try {
      const {
        name,
        price,
        no_bpom,
        no_medicine,
        packaging,
        discount,
        categoryName,
      } = req.body;

      const findCategory = await Category.findOne({
        where: { name: categoryName },
      });

      const categoryId = findCategory.dataValues.id;

      const newProduct = await Product.create({
        name,
        price,
        no_bpom,
        no_medicine,
        packaging,
        discount,
        CategoryId: categoryId,
      });

      const productId = newProduct.dataValues.id;

      console.log(productId);

      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "product_images";
      const filename = req.files;

      const listFile = filename.map((val) => {
        return {
          image_url: `${uploadFileDomain}/${filePath}/${val.filename}`,
          product_id: productId,
        };
      });

      await ProductImage.bulkCreate(listFile);

      return this.handleSuccess({
        message: "Created New Product",
        statusCode: 201,
        data: newProduct,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static addStockProduct = async (req) => {
    try {
      const { token } = req;
      const { productName, quantity, expired_date, purchasePrice } = req.body;

      const findProduct = await Product.findOne({
        where: { name: productName },
      });

      const productId = findProduct.dataValues.id;

      const newStock = await Inventory.create({
        quantity,
        expired_date,
        type: "available",
        product_id: productId,
        admin_id: token.admin_id,
      });

      const findStockOpnames = await StockOpname.findOne({
        where: { product_id: productId },
      });

      if (!findStockOpnames) {
        await StockOpname.create({
          amount: quantity,
          product_id: productId,
        });
      } else {
        const findAvailableInventoryByProductId = await Inventory.findAll({
          where: {
            type: "available",
            product_id: productId,
          },
          attributes: ["quantity"],
        });

        const StockAvailable = findAvailableInventoryByProductId.map(
          (val) => val.dataValues.quantity
        );

        const newTotalStockInStockOpname = StockAvailable.reduce(
          (total, num) => total + num
        );

        await StockOpname.update(
          { amount: newTotalStockInStockOpname },
          { where: { product_id: productId } }
        );
      }

      await PurchaseOrder.create({
        quantity,
        price: purchasePrice,
        product_id: productId,
      });

      return this.handleSuccess({
        message: "Created New Product",
        statusCode: 201,
        data: newStock,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static editProduct = async (req) => {
    try {
      const { productId } = req.params;
      const { productName, price, category_Id } = req.body;

      const checkDuplicate = await Product.findOne({
        where: {
          name: productName,
          id: {
            [Op.ne]: productId,
          },
        },
      });

      if (checkDuplicate?.dataValues.name === productName) {
        return this.handleError({
          message: "data duplicate please try another med_name",
          statusCode: 400,
        });
      }

      await Product.update(
        {
          name: productName,
          price,
          CategoryId: category_Id,
        },
        {
          where: { id: productId },
        }
      );

      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "product_images";
      const filename = req.files;

      if (filename) {
        const listFile = filename.map((val) => {
          return {
            image_url: `${uploadFileDomain}/${filePath}/${val.filename}`,
            product_id: productId,
          };
        });

        await ProductImage.bulkCreate(listFile);
      }

      return this.handleSuccess({
        message: "product edited",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static getAllProductWithQuantity = async (req) => {
    try {
      const {
        _limit = 30,
        _page = 1,
        _sortBy = "",
        _sortDir = "",
        name = "",
        selectedCategory,
      } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.name;
      delete req.query.selectedCategory;

      const whereCategoryClause = {};

      if (selectedCategory) {
        whereCategoryClause.CategoryId = selectedCategory;
      }

      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
          name: {
            [Op.like]: `%${name}%`,
          },
          ...whereCategoryClause,
        },
        include: [
          {
            model: Category,
          },
          {
            model: StockOpname,
          },
          {
            model: ProductImage,
            attributes: ["image_url", "id", "product_id"],
          },
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      return this.handleSuccess({
        message: "get all products",
        statusCode: 200,
        data: findProducts,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "server error",
        statusCode: 500,
      });
    }
  };

  static deleteProductImage = async (req) => {
    try {
      const { productId, id } = req.params;

      await ProductImage.destroy({
        where: {
          product_id: productId,
          id,
        },
      });

      return this.handleSuccess({
        message: "succes delete image",
        statusCode: 200,
      });
    } catch (err) {
      return this.handleError({});
    }
  };

  static getStockByProductId = async (req) => {
    try {
      const { _limit = 30, _page = 1 } = req.query;
      const { productId } = req.params;

      delete req.query._limit;
      delete req.query._page;

      const findInventory = await Inventory.findAndCountAll({
        where: {
          product_id: productId,
          ...req.query,
        },
        include: [
          {
            model: Product,
            attributes: ["id"],
            include: [StockOpname],
            required: false,
          },
          { model: Admin },
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        distinct: true,
      });
      return this.handleSuccess({
        message: "get all inventory",
        statusCode: 200,
        data: findInventory,
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

module.exports = ProductService;
