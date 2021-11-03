const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const authRoute = require("./api/routes/auth");
const meRoute = require("./api/routes/me");
const cartRoute = require("./api/routes/cart");
const passwordRoute = require("./api/routes/password");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get(
  ["/", "/login", "/register", "/cart", "/user", "/product/:id"],
  function (req, res) {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  }
);
app.get(["/favicon.ico"], function (req, res) {
  res.sendFile(path.join(__dirname, "../../frontend/build", "favicon.ico"));
});
app.get(["/manifest.json"], function (req, res) {
  res.sendFile(path.join(__dirname, "../../frontend/build", "manifest.json"));
});

app.use(
  express.static(path.join(__dirname, "../../frontend/build"), {
    maxAge: "365 days",
    immutable: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/me", meRoute);
app.use("/api/cart", cartRoute);
app.use("/api/password", passwordRoute);

app.use((req, res, next) => {
  console.log(path.join(__dirname, "../../frontend/build"));
  console.log(path.join(process.cwd(), "../frontend/build"));
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(req);
  res.status(error.status || 500);
  res.json({
    error: {
      ciao: "ciao",
      message: error.message,
    },
  });
});

module.exports = app;
