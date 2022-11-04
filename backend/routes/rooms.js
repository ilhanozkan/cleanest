const express = require("express");
const router = express.Router();

const { io } = require("..");

router.get("/", (req, res, next) => {
  res.send("ok");
  next();
});

module.exports = router;
