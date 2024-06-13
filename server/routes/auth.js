const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  resetPassword,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
