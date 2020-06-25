const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const usersRoute = require("./api/routes/auth");
const meRoute = require("./api/routes/me");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get(["/", "/login", "/register", "/cart", "/user"], function (req, res) {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});
app.get(["/favicon.ico"], function (req, res) {
  res.sendFile(path.join(process.cwd(), "build", "favicon.ico"));
});
app.get(["/manifest.json"], function (req, res) {
  res.sendFile(path.join(process.cwd(), "build", "manifest.json"));
});

app.use("/static", express.static("build/static"));

app.use("/api/auth", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/me", meRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
