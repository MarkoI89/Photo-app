const router = require("express").Router();
const Image = require("../models/Image.model");

const User = require("../models/User.model")
const fileUploader = require('../config/cloudinary.config');
const {
  photographerCheck, isAuthenticated
} = require("../middleware/index.middleware");

// create image

router.post("/",isAuthenticated, photographerCheck, fileUploader.single('image'), async (req, res, next) => {
  const {
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
      shot_by: req.user.id,
      model,
      makeup_artist,
    });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});
// find image
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const {
      shot_by,
      model: modelUsername,
      makeup_artist
    } = req.query;
    const searchQuery = {};
    const photographer = await User.findOne({
      username: shot_by
    });
    const model = await User.findOne({
      username: modelUsername
    });
    const makeupArtist = await User.findOne({
      username: makeup_artist
    });
    if (photographer) {
      searchQuery.shot_by = photographer.id;
    }
    if (model) {
      searchQuery.model = model.id;
    }
    if (makeupArtist) {
      searchQuery.makeup_artist = makeupArtist.id;
    }
    const shot_byFilter = await Image.find(searchQuery);
    res.status(200).json(shot_byFilter);
  } catch (error) {
    next(error);
  }
});

// find image by id
router.get("/:imageId", isAuthenticated, async (req, res, next) => {

  const {
    imageId
  } = req.params;
  await Image.findById(imageId)
    .populate("shot_by model makeup_artist")

    .then((image) => res.status(200).json(image))
    .catch((error) => next(error));
});

// delete image

// added middleware to check if photographer
router.delete("/:imageId",isAuthenticated, photographerCheck, async (req, res, next) => {
  const {
    imageId
  } = req.params;
  await Image.findByIdAndDelete(imageId)
    .then((deletedImage) => res.status(200).json(deletedImage))
    .catch((error) => next(error));
});

module.exports = router;