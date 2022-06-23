const fileUploader = require("../lib/uploader");
const UserService = require("../services/user");

const router = require("express").Router();

router.patch(
  "/",
  async (req, res) => {
    try {
      const serviceResult = await UserService.editProfile(req);

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
  }
);

router.patch(
  "/profile-picture/:id",
  fileUploader({
    destinationFolder: "profile-image",
    fileType: "image",
    prefix: "POST",
  }).single("profile_image_file"),
  async (req, res) => {
     try {
       const serviceResult = await UserService.changeProfilePicture(req);

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
  }
);

router.post("/address", async (req, res) => {
  try {
    const serviceResult = await UserService.addAddress(req);

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
