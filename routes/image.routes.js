const router = require("express").Router();
const Image = require("../models/Image.model");
const User = require("../models/User.model")
const fileUploader = require('../config/cloudinary.config')
// create image

router.post("/", fileUploader.single('image'), async (req, res, next) => {
  const {

    shot_by,
    model,
    makeup_artist
  } = req.body;
  try {
    let link = ''
    if (!req.file) {
      return res.json({
        message: "Add the image",
      });
    } else {
      link = req.file.path
    }
    const newImage = await Image.create({
      link,
      shot_by,
      model,
      makeup_artist,
    });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});
// find image
router.get("/", async (req, res, next) => {
  try {
    const allImages = await Image.find();
    res.status(200).json(allImages);
  } catch (error) {
    next(error);
  }
});

// find image by id
router.get("/:imageId", async (req, res, next) => {
  const {
    imageId
  } = req.params;
  await User.findById(imageId)
    .then((image) => res.status(200).json(image))
    .catch((error) => next(error));
});

// delete image

module.exports = router;