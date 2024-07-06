const express = require("express");
const router = express.Router();
const {
  getUserTypingInfo,
  handleUserTypingInfo,
  getTopUsers,
} = require("../controllers/typingInfo");

router.route("/").get(getUserTypingInfo);
router.route("/").post(handleUserTypingInfo);
router.route("/top-users").get(getTopUsers);

module.exports = router;
