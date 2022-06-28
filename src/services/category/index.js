const { Category } = require("../../lib/sequelize");
const Service = require("../service");

class CategoryService extends Service {
  static getCategory = async (req) => {
    try {
      const findCategory = await Category.findAll();

      return this.handleSuccess({
        message: "get all category",
        statusCode: 200,
        data: findCategory
      })
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = CategoryService