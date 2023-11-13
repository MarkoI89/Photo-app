const router = require("express").Router();
const Image = require("../models/Image.model");

const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
const {
  photographerCheck,
  isAuthenticated,
} = require("../middleware/index.middleware");

// create image
router.post(
  "/",
  photographerCheck,
  fileUploader.single("image"),
  async (req, res, next) => {
    const { user, description, photographer, model, makeup_artist } = req.body;
    try {
      let link = "";
      if (!req.file) {
        return res.json({
          message: "Add the image",
        });
      } else {
        link = req.file.path;
      }
      const newImage = await Image.create({
        user,
        link,
        description,
        photographer,
        model,
        makeup_artist,
      });
      res.status(201).json(newImage);
    } catch (error) {
      next(error);
    }
  }
);
// find image
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { shot_by, model: modelUsername, makeup_artist } = req.query;
    const searchQuery = {};
    const photographer = await User.findOne({
      username: shot_by,
    });
    const model = await User.findOne({
      username: modelUsername,
    });
    const makeupArtist = await User.findOne({
      username: makeup_artist,
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
    const shot_byFilter = await Image.find(searchQuery).populate(
      "model shot_by makeup_artist"
    );
    res.status(200).json(shot_byFilter);
  } catch (error) {
    next(error);
  }
});

//Find photos where user is tagged

router.get("/user/:username/tags", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const images = await Image.find({
      $or: [
        { photographer: username },
        { model: username },
        { makeup_artist: username },
      ],
    }).populate({
      path: "user",
      model: "User",
      select: "firstName lastName avatar username",
    });

    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Users images
router.get("/user/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const allPicsFromUser = await Image.find({ user: id })
      .populate({
        path: "user",
        model: "User",
        select: "firstName lastName avatar username",
      })
      .exec();
    res.status(200).json(allPicsFromUser);
  } catch (error) {
    next(error);
  }
});

// find friends images
router.get("/user/:userId/friends-photos", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's friends
    const friends = user.friends;

    // Find images uploaded by user's friends
    const friendPhotos = await Image.find({ user: { $in: friends } });
    // .populate("photographer")
    // .populate("model")
    // .populate("makeup_artist");

    res.json({ friendPhotos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//like image

router.patch("/like/:pictureId", isAuthenticated, async (req, res) => {
  try {
    const { pictureId } = req.params;
    const { userId } = req.body;
    const photo = await Image.findById(pictureId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    console.log("Found photo:", photo);
    const isLiked = photo.likes.get(userId);

    console.log("Received pictureId:", pictureId);
    console.log("Received userId:", userId);

    if (isLiked) {
      photo.likes.delete(userId);
    } else {
      photo.likes.set(userId, true);
    }

    const updatedPost = await Image.findByIdAndUpdate(
      pictureId,
      { likes: photo.likes },
      { new: true }
    );

    console.log("Updated post:", updatedPost);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// find image by id
router.get("/:imageId", isAuthenticated, async (req, res, next) => {
  const { imageId } = req.params;
  await Image.findById(imageId)
    // .populate("shot_by model makeup_artist")

    .then((image) => res.status(200).json(image))
    .catch((error) => next(error));
});

// delete image

// added middleware to check if photographer
router.delete("/:imageId", photographerCheck, (req, res, next) => {
  const { imageId } = req.params;
  Image.findOneAndDelete({
    $and: [{ _id: imageId }, { shot_by: req.user.id }],
  })
    .then((deletedImage) => res.status(200).json(deletedImage))
    .catch((error) => next(error));
});

module.exports = router;
