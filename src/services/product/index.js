const { Product, ProductImage } = require("../../lib/sequelize");
const Service = require("../service");

class ProductService extends Service {
  static getAllProduct = async (req) => {
    try {
      const { _limit = 30, _page = 1, _sortBy = "", _sortDir = "" } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;

      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
        },
        include: [
            {
                model: ProductImage,
                attributes: ["image_url"]
            }
        ],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
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
}

module.exports = ProductService;
