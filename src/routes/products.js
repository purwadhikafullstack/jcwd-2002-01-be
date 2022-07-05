const ProductService = require("../services/product");
const productControllers = require("../controllers/productController");
const fileUploader = require("../lib/uploader");

const router = require("express").Router();

router.get("/byId/:productId", productControllers.getProduct);

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
  productControllers.createProduct
);

router.post("/addstock", productControllers.createProductStock);

router.get("/quantity", productControllers.getAllProductWithQuantity);

module.exports = router;
