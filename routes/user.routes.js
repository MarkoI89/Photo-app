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

router.get("/", async (req, res, next) => {
  // console.log what is req.query
  // if req.query exist
  // get the user and filter them by role using req.query.role
  // else just get all users
  try {
    // console.log(req.query)

    const { role } = req.query;
    const { username } = req.query;
    const query = {}
    if (role) {
      query["$or"].push({role})
    }
    if (username) {
      query["$or"].push({username})
    } 
      const allUsers = await User.find(query);
      return res.status(200).json(allUsers);
    
  } catch (error) {
    next(error);
  }
});

// Create a new user
// router.post("/", isAuthenticated, async (req, res, next) => {
//   try {
//     const { username, role, password, email } = req.body;
//     if (!username || !role || !password || !email) {
//       return res.json({
//         message: "You should fill all the required fields",
//       });
//     }
//     const newUser = await User.create({
//       username: req.body.username,
//       role: req.body.role,
//       password: req.body.password,
//       email: req.body.email,
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     next(error);
//   }
// });

// Find user by Id

router.get("/:userId", isAuthenticated, async (req, res, next) => {
  const {
    userId
  } = req.params;
  await User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((error) => next(error));
});

// Update users details
// check if user is

router.patch("/:userId", isAuthenticated, async (req, res, next) => {
  const {
    userId
  } = req.params;

  const {
    role,
    password
  } = req.body;
  await User.findByIdAndUpdate(userId, {
      role,
      password
    }, {
      new: true
    })

    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => next(error));
});
// Delete user

router.delete("/", isAuthenticated, async (req, res, next) => {


  await User.findByIdAndDelete(req.user.id)
    .then((deletedUser) => res.sendStatus(204))
    .catch((error) => next(error));
});

module.exports = router;