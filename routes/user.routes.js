const router = require("express").Router();
const User = require("../models/User.model");

/**
 * All routes are prefixed with /api/user
 */

// find all users

router.get("/", async (req, res, next) => {
  // console.log what is req.query
  // if req.query exist
  // get the user and filter them by role using req.query.role
  // else just get all users
  try {
    // console.log(req.query)
    const {
      role
    } = req.query;
    if (req.query.role) {
      const roleFilter = await User.find({
        role
      });
      res.json(roleFilter);
    } else {
      const allUsers = await User.find();
      return res.status(200).json(allUsers);
    }
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post("/create", async (req, res) => {
  try {
    const {
      username,
      role,
      password,
      email
    } = req.body;
    if (!username || !role || !password || !email) {
      return res.json({
        message: "You should fill all the required fields",
      });
    }
    const newUser = await User.create({
      username: req.body.username,
      role: req.body.role,
      password: req.body.password,
      email: req.body.email,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Find user by Id

router.get("/:userId", async (req, res) => {
  const {
    userId
  } = req.params;
  await User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((error) => next(error));
});

// Update users details

router.patch("/:userId/update", async (req, res) => {
  const {
    userId
  } = req.params;
  const {
    username,
    role,
    password
  } = req.body;
  await User.findByIdAndUpdate(
      userId, {
        username,
        role,
        password
      }, {
        new: true
      }
    )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => next(error));
});

router.delete("/:userId/delete", async (req, res) => {
  const {
    userId
  } = req.params;
  await User.findByIdAndDelete(userId)
    .then((deletedUser) => res.status(200).json(deletedUser))
    .catch((error) => next(error));
});

module.exports = router;