const express = require("express");
const router = express.Router();
const path = require("path");
const pathToSignin = path.join(__dirname, "signin");
const pathToSignup = path.join(__dirname, "signup");
const pathToDashboard = path.join(__dirname, "dashboard");
const pathToTemp = path.join(__dirname, "code_along");

router.get("/", (req, res) => {
  res.status(200).send({
    message:
      "I am too lazy to make a homepage ... anyone who wants to contribute please send a pr, GFS-IIITBH loves PRs!!",
    status: "Up and running! follow available routes--->",
    signin: "/signin",
    signup: "/signup",
  });
});

router.use("/signin", express.static(pathToSignin));
router.use("/signup", express.static(pathToSignup));
router.use("/testing", express.static(pathToTemp));
router.use("/dashboard", express.static(pathToDashboard));

module.exports = router;
