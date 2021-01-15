const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard_controller");

router.get("/", dashboardController.getRoomMembers);
console.log("hi in dashboard");
module.exports = router;
