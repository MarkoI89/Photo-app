const router = require("express").Router();
const Image = require("../models/Image.model");
const User = require("../models/User.model");
// create image

router.post("/", async (req, res, next) => {
  try {
    const { link, shot_by, model, makeup_artist } = req.body;
    if (!link) {
      return res.json({
        message: "Add the image",
      });
    }
    const newImage = await Image.create({
      link: req.body.link,
      shot_by: req.body.shot_by,
      model: req.body.model,
      makeup_artist: req.body.makeup_artist,
    });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});
// find image
router.get("/", async (req, res, next) => {
  try {
    const { shot_by, model: modelUsername, makeup_artist } = req.query;
    const searchQuery = {};
    const photographer = await User.findOne({ username: shot_by });
    const model = await User.findOne({ username: modelUsername });
    const makeupArtist = await User.findOne({ username: makeup_artist });
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
router.get("/:imageId", async (req, res, next) => {
  const { imageId } = req.params;
  await Image.findById(imageId)
    .populate("shot_by model makeup_artist")
    .then((image) => res.status(200).json(image))
    .catch((error) => next(error));
});

// delete image

router.delete("/:imageId", async (req, res, next) => {
  const { imageId } = req.params;
  await Image.findByIdAndDelete(imageId)
    .then((deletedImage) => res.status(200).json(deletedImage))
    .catch((error) => next(error));
});

module.exports = router;
