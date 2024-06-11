const express = require("express");
const router = express.Router();
const {
  getUserTypingInfo,
  handleUserTypingInfo,
  getUserScores,
} = require("../controllers/typingInfo");

router.route("/").get(getUserTypingInfo);
router.route("/").post(handleUserTypingInfo);
router.route("/user").get(getUserScores);

module.exports = router;
