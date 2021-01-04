const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let jwt_opts = {
  issuer: "accounts.gupta.com",
  expiresIn: "7d",
};
const signin = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist, try signing up...",
      });
    }
    await bcrypt.compare(password, user.password, (err, isMatched) => {
      if (err) {
        console.log(err);
      }
      if (isMatched) {
        return res.status(200).json({
          success: true,
          access_token: jwt.sign({ email }, process.env.JWT_SECRET, jwt_opts),
        });
      }

      res.status(500).json({
        success: false,
        message: "Error signing in",
      });
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Bad Credentials",
    });
  }
};
const signup = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password;
    const name = req.body.name;
    const userImage = req.body.img_base64;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist, try signing in...",
      });
    }
    const user_model = new User({
      email,
      password,
      name,
      userImage,
    });

    await user_model.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error signing up, try again later",
        });
      }

      res.status(200).json({
        success: true,
        message: "Successfully signed up!",
      });
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Bad Credentials",
    });
  }
};
module.exports = { signin, signup };
