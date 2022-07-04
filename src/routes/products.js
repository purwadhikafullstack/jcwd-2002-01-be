const { productController } = require("../controllers");
const fileUploader = require("../lib/uploader");
const ProductService = require("../services/product");
const productControllers = require("../controllers/productController");

const router = require("express").Router();

router.get("/:productId", productControllers.getProduct);

router.get("/", async (req, res) => {
  try {
    const serviceResult = await ProductService.getAllProduct(req);

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

router.post(
  "/",
  fileUploader({
    destinationFolder: "product-image",
    fileType: "image",
    prefix: "POST",
  }).array("product_image_file"),
  productController.createProduct
);

router.post("/addstock", productController.createProductStock);

module.exports = router;
