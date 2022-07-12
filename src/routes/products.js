const { productController } = require("../controllers");
const fileUploader = require("../lib/uploader");
const ProductService = require("../services/product");

const { AuthorizeLoggedInAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/byId/:product", productController.getProduct);

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

router.post(
  "/addstock",
  AuthorizeLoggedInAdmin,
  productController.createProductStock
);

router.get("/quantity", productController.getAllProductWithQuantity);
router.patch(
  "/edit/:productId",
  fileUploader({
    destinationFolder: "product-image",
    fileType: "image",
    prefix: "POST",
  }).array("product_image_file"),
  productController.editProduct
);

router.delete(
  "/product-image/:id/images/:productId",
  productController.deleteProductImage
);

router.delete(
  "/product/:productId",
  AuthorizeLoggedInAdmin,
  productController.deleteProduct
);

router.get("/inventory/:productId", productController.getInventoryByProductId);
// router.get("/products", ProductService.getAllProduct);

router.get("/quantity", productController.getAllProductWithQuantity);
router.patch(
  "/edit/:productId",
  fileUploader({
    destinationFolder: "product-image",
    fileType: "image",
    prefix: "POST",
  }).array("product_image_file"),
  productController.editProduct
);

router.delete(
  "/product-image/:id/images/:productId",
  productController.deleteProductImage
);

router.get("/invenroty/:productId", productController.getInventoryByProductId);

router.get("/quantity", productController.getAllProductWithQuantity);
router.patch(
  "/edit/:productId",
  fileUploader({
    destinationFolder: "product-image",
    fileType: "image",
    prefix: "POST",
  }).array("product_image_file"),
  productController.editProduct
);

router.delete(
  "/product-image/:id/images/:productId",
  productController.deleteProductImage
);

module.exports = router;
