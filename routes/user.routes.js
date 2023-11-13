const router = require("express").Router();
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

const {
  isAuthenticated,
  photographerCheck,
} = require("./../middleware/index.middleware");
/**
 * All routes are prefixed with /api/user
 */

// find all users

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { role } = req.query;
    const { username } = req.query;

    const query = { $or: [] };

    if (role) {
      query["$or"].push({ role });
    }
    if (username) {
      query["$or"].push({ username: { $regex: username, $options: "i" } });
    }
    if (query["$or"].length === 0) {
      delete query["$or"];
    }
    const allUsers = await User.find(query);
    for (const user of allUsers) {
      user.password = undefined;
    }

    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

// Find user by Id

router.get("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  await User.findById(userId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => next(error));
});

// Edit User's info

router.patch(
  "/",
  fileUploader.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  isAuthenticated,

  async (req, res, next) => {
    const { firstName, lastName, username, location, about } = req.body;
    try {
      let avatar;
      let cover;

      if (req.files && req.files["avatar"] && req.files["avatar"][0]) {
        avatar = req.files["avatar"][0].path;
      }

      if (req.files && req.files["cover"] && req.files["cover"][0]) {
        cover = req.files["cover"][0].path;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar, cover, firstName, lastName, username, location, about },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

//get friends list

router.get("/:userId/friends", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends;

    const friends = await User.find({ _id: { $in: friendIds } });

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, username, role, location, avatar }) => {
        return { _id, firstName, lastName, username, role, location, avatar };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add remove friend
router.patch("/:userId/:friendId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((userId) => userId !== friendId);
      friend.friends = friend.friends.filter((userId) => userId !== friendId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((userId) => User.findById(userId))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, username, role, location, avatar }) => {
        return { _id, firstName, lastName, username, role, location, avatar };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Delete user

router.delete("/", isAuthenticated, (req, res, next) => {
  User.findByIdAndDelete(req.user.id)
    .then((deletedUser) => res.sendStatus(204))
    .catch((error) => next(error));
});

module.exports = router;
