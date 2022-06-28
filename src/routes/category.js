const CategoryService = require("../services/category");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const serviceResult = await CategoryService.getCategory(req);

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
});

module.exports = router