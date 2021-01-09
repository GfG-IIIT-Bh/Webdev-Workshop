const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let jwt_opts = {
  issuer: "accounts.gupta.com",
  expiresIn: "7d",
};

const iiitidregex = /^[a-c][1-5][0-9]*$/i;
const branchData = {
  1: "CSE",
  2: "EEE",
  3: "ETC",
  4: "IT",
  5: "CE",
};
const deptData = {
  a: "M.TECH",
  b: "B.TECH",
  c: "PHD",
};
const findBatchDetails = (email) => {
  return new Promise((resolve, rej) => {
    let flag;
    const domain = email.split("@")[1];
    const id = email.split("@")[0];
    if (domain != "iiit-bh.ac.in") {
      flag = {
        success: false,
        message: "This portal is only made for IIIT-BH students.",
      };
    } else if (iiitidregex.test(id) && id.length == 7) {
      const dept = id[0];
      const branch_code = id[1];
      const acadYear = "20" + id.slice(2, 4);
      const roomName =
        deptData[dept] + " - " + branchData[branch_code] + " " + acadYear;

      flag = { success: true, roomName };
    } else {
      flag = {
        success: false,
        message: "Please provide a proper college email-id",
      };
    }
    resolve(flag);
  });
};
const signin = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
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
          token: jwt.sign({ email }, process.env.JWT_SECRET, jwt_opts),
          message: "Signed in successfully",
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
    const email = req.body.email.trim().toLowerCase();
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
    const roomDetails = await findBatchDetails(email);
    if (!roomDetails.success) {
      return res.status(403).json({
        success: false,
        message: roomDetails.message,
      });
    }

    const user_model = new User({
      email,
      password,
      name,
      userImage,
      roomName: roomDetails.roomName,
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
