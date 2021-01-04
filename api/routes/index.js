const express = require("express");
const userAuth = require("../middlewares/user_auth");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("reached");
});
router.use("/signin", require("./signin"));
router.use("/signup", require("./signup"));
router.use("/dashboard", userAuth, require("./dashboard"));
module.exports = router;
