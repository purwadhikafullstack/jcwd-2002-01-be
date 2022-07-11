const {addressController} = require("../controllers")
const router = require("express").Router()

router.get("/province", addressController.getProvince)
router.get("/city/:province_id", addressController.getCity)

module.exports = router