const poolPromise = require("../db/connect");
const getUserScores = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { user_id } = req.query;

    const date = new Date();
    let userIdQuery = " ";
    let updateData = [];
    if (user_id) {
      userIdQuery = ` where user_id =? `;
      updateData.push(user_id);
    }
    // SELECT AVG(a.total_score), a.user_id, b.name FROM typinginfo as a JOIN users as b ON a.user_id=b.id GROUP BY a.user_id ORDER BY AVG(a.total_score) DESC LIMIT 10;
    const updateQuery =
      `SELECT  a.user_id, b.name FROM typinginfo as a JOIN users as b ON a.user_id=b.id` +
      userIdQuery +
      `GROUP BY a.user_id ORDER BY AVG(a.total_score) DESC LIMIT 10`;
    const [rows] = await pool.query(updateQuery, updateData);
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: " Server issue. Please try again after sometime." });
  }
};

const getUserTypingInfo = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { user_id } = req.query;
    const date = new Date();
    const updateQuery = `SELECT AVG(a.total_score) as total_score, YEAR(a.completed_on) AS year, count(*) as contribution_count, MONTH(a.completed_on) AS month FROM typinginfo as a INNER JOIN users as b ON a.user_id=b.id where a.user_id = ? and YEAR(a.completed_on)=? GROUP BY MONTH(a.completed_on), YEAR(a.completed_on) ORDER BY year, month;`;
    const updateData = [user_id, date.getFullYear()];
    const [monthly] = await pool.query(updateQuery, updateData);
    const updateQuery2 = `SELECT AVG(a.total_score) as total_score, count(a.total_score) as total_count, b.name,  DATE(b.created_at) as created_at, b.id as user_id FROM typinginfo as a RIGHT JOIN users as b ON a.user_id=b.id where b.id = ?`;
    const updateData2 = [user_id];
    const [data] = await pool.query(updateQuery2, updateData2);
    res.status(200).json({ monthly, data });
  } catch (error) {
    res
      .status(500)
      .json({ message: " Server issue. Please try again after sometime." });
  }
};
const handleUserTypingInfo = async (req, res) => {
  try {
    console.log("hey");
    const pool = await poolPromise;
    const date = new Date();
    const { user_id, chars_per_min, accuracy_percent } = req.body;
    let totalScore = (chars_per_min / 300) * (accuracy_percent / 100);
    totalScore = totalScore < 1 ? Number(totalScore.toFixed(3)) : 1;
    const updateQuery = `INSERT INTO typinginfo (user_id, chars_per_min, accuracy_percent, completed_on, total_score) values (?,?,?,?,?)`;
    const updateData = [
      user_id,
      chars_per_min,
      accuracy_percent,
      date,
      totalScore,
    ];
    await pool.query(updateQuery, updateData);
    res.status(200).json({ message: "Score submitted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: " Server issue. Please try again after sometime." });
  }
};

module.exports = { getUserTypingInfo, handleUserTypingInfo, getUserScores };