const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const poolPromise = mysql
  .createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DBNAME,
    dateStrings: true,
  })
  .promise();

module.exports = poolPromise;
