const poolPromise = require("../db/connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const setCookie = (res, data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    expires: new Date(Date.now() + parseInt(process.env.TOKEN_MAX_AGE) * 60 * 60 * 1000),
    sameSite: "Strict",
    secure: true,
  });

  console.log(res);
};

const getEmailId = async (email, pool) => {
  const getEmailQuery = `select * from users where email = ?`;
  const [rows] = await pool.query(getEmailQuery, [email]);
  return rows;
};

const resetPassword = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password } = req.body;
    const rows = await getEmailId(email, pool);
    if (rows.length > 0) {
      let hashedPassword = await bcrypt.hash(password, 8);
      const updateQuery = `UPDATE users SET password = ? where email = ?`;
      const updateData = [hashedPassword, email];
      await pool.query(updateQuery, updateData);
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "No prior account exit" });
    }
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { name, email, password } = req.body;
    const rows = await getEmailId(email, pool);
    if (rows.length > 0) {
      return res.status(401).send({ message: "That email is already in use" });
    }
    //round of time the password is hashed = 8 (more secured)
    const date = new Date();
    let hashedPassword = await bcrypt.hash(password, 8);
    const updateQuery = `INSERT INTO users (name, email, password, created_at, updated_at) values (?,?,?,?,?)`;
    const updateData = [name, email, hashedPassword, date, date];
    const data = await pool.query(updateQuery, updateData);
    const user_id = data[0].insertId;
    tokenData = { user_id: user_id, name: name, email: email };
    setCookie(res, tokenData);
    res.status(200).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Server issue. Please try again after sometime." });
  }
};

const login = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password } = req.body;
    const rows = await getEmailId(email, pool);
    if (rows.length > 0) {
      const date = new Date();
      const updateQuery = `UPDATE users SET updated_at = ? where email = ?`;
      const updateData = [date, email];
      await pool.query(updateQuery, updateData);
      const { id, name, password: actualPassword } = rows[0];
      const response = await bcrypt.compare(
        password.toString(),
        actualPassword
      );
      console.log(response);
      if (response) {
        tokenData = { email: email, name: name, user_id: id };
        setCookie(res, tokenData);
        res.status(200).json({ message: "LoggedIn successfully" });
      } else {
        res.status(401).json({ message: "Incorrect Email and Password" });
      }
    } else {
      res.status(401).json({ message: "No prior account exit" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: " Server issue. Please try again after sometime." });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "logout successfully" });
};

module.exports = { register, login, logout, resetPassword };
