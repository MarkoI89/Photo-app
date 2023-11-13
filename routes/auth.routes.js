const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const salt = 10;
const { isAuthenticated } = require("./../middleware/index.middleware");

// Signup
router.post("/signup", async (req, res, next) => {
  const { username, email, password, role, firstName, lastName } = req.body;
  if (!password || !email || !firstName || !lastName || !username) {
    return res
      .status(400)
      .json({ message: "Please provide all the informations." });
  }
  try {
    const foundUser = await User.findOne({ $or: [{ username }, { email }] });
    if (foundUser) {
      return res.status(400).json({
        message:
          "Username or email already exist, try logging in or registering with an other username / email.",
      });
    }

    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = {
      username,
      email,
      role,
      firstName,
      lastName,
      password: hashedPassword,
    };
    const createdUser = await User.create(newUser);
    const userObject = createdUser.toObject();
    delete userObject.password;
    res.status(201).json(userObject);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    // const matchingPassword = await bcrypt.compare(password, foundUser.password)
    if (!matchingPassword) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const payload = { email };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res) => res.json(req.user));

module.exports = router;
