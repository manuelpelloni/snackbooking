const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const usersRoute = require("./api/routes/auth");
const meRoute = require("./api/routes/me");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

console.log(process.cwd());
app.get("/", function (req, res) {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

app.use("/api/auth", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/me", meRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status(404);
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
