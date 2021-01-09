const iiitidregex = /^[a-c][1-5][0-9]*$/i;
const User = require("../models/users");
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
    var flag;
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
    console.log(flag);
    resolve(flag);
  });
};

const getRoomMembers = async (req, res) => {
  const roomDetails = await findBatchDetails(req.user);
  if (roomDetails.success) {
    const roomName = roomDetails.roomName;
    const roomMembers = await User.find({ roomName });
    var roomData = [];
    let userData;
    roomMembers.forEach((member) => {
      const { email, name, userImage } = member;
      if (email == req.user) {
        userData = { email, name, userImage };
      }
      roomData.push({ email, name, userImage });
    });
    res.status(200).json({
      success: true,
      data: roomData,
      user: userData,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Please signin again, some error occured",
    });
  }
};

module.exports = {
  getRoomMembers,
};
