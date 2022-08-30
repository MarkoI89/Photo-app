const { Router } = require("express");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require('./auth.routes'))
router.use("/user", require("./user.routes"));
router.use("/image", require("./image.routes"));

module.exports = router;
// You put the next routes here 👇
// example: router.use("/auth", authRoutes)
