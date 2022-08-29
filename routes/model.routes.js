const router = require("express").Router();
const Model = require("../models/User.model");

// router.get("/", (req, res, next) => {
//   res.json("It all works");
// });
// router.get("/user", async (req, res, next) => {
//   try {
//     const allUsers = await User.find();
//     return res.status(200).json(allUsers);
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/user", async (req, res) => {
//   const { username, role, password, email } = req.body;
//   const user = await User.create({
//     username,
//     role,
//     password,
//     email,
//   });
//   res.json({ user });
// });

// router.get("/user/:id", async (req, res) => {
//   const userId = await User.findById(req.params.id);
//   res.json({ userId });
// });

module.exports = router;