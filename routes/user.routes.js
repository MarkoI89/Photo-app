const router = require("express").Router();
const User = require("../models/User.model");

/**
 * All routes are prefixed with /api/user
 */
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  const { username, role, password, email } = req.body;
  const user = await User.create({
    username,
    role,
    password,
    email,
  });
  res.json({ user });
});

router.get("/:id", async (req, res) => {
  const userId = await User.findById(req.params.id);
  res.json({ userId });
});

module.exports = router;
