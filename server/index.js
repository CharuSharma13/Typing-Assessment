const express = require("express");
const authRoute = require("./routes/auth");
const gameRoute = require("./routes/typingInfo");
const poolPromise = require("./db/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// parse json bodies (as sent by API clients)
app.use(express.json());


app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

// parse url-encoded bodies (as send by html forms)
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    key: "token",
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + parseInt(process.env.TOKEN_MAX_AGE) * 60 * 60 * 1000),
    },
  })
);
app.use("/auth", authRoute);
app.use("/v1/stats", gameRoute);

const start = async () => {
  try {
    await poolPromise;
    app.listen(PORT, () => {
      console.log(`${PORT} connected`);
    });
  } catch (error) {}
};

start();
