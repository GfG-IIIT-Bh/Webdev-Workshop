const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    //this is the primary key for the user collection
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    //for this workshop we are using base64 str images later on students can use multer and aws s3 for optimised storing of images
    userImage: {
      type: String,
    },
    roomName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
