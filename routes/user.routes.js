const router = require("express").Router();
const User = require("../models/User.model");
const {
  isAuthenticated,
  photographerCheck,
} = require("./../middleware/index.middleware");
/**
 * All routes are prefixed with /api/user
 */

// find all users

router.get("/",isAuthenticated, async (req, res, next) => {

  try {
    // console.log(req.query)

    const { role } = req.query;
    const { username } = req.query;

    const query = { $or: [] };

   
    if (role) {
      query["$or"].push( {role} );
    }
    if (username) {
      query["$or"].push({ username });
    }
    if (query["$or"].length === 0) {
      delete query["$or"];
    }
    const allUsers = await User.find(query);
    for (const user of allUsers) {
      user.password = undefined
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
      user.password = undefined
      res.status(200).json(user)
    })
    .catch((error) => next(error));
});

// Update users details
// Check if token or ID are the same
// Check updatedUser

router.patch("/", isAuthenticated , (req, res, next) => {
  // const { userId } = req.params;

  const { role } = req.body;
  User.findByIdAndUpdate(req.user._id, {$addToSet: {role}}, { new: true })

    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => next(error));
});
// Delete user

router.delete("/", isAuthenticated,  (req, res, next) => {
  User.findByIdAndDelete(req.user.id)
    .then((deletedUser) => res.sendStatus(204))
    .catch((error) => next(error));
});

module.exports = router;
