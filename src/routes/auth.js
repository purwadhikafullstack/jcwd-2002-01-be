const authService = require("../services/auth");
const {
  runValidator,
  rulesValidation,
} = require("../validation/registerValidation");
const router = require("express").Router();

router.post("/register", rulesValidation, runValidator, async (req, res) => {
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
});

module.exports = router;
