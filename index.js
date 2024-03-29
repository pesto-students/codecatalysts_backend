var express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.config.js");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
require("dotenv").config();
const PORT = process.env.PORT;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// connecting to db
connectDB();

app.use("/v1", require("./routes/user.route"));
app.use("/v1", require("./routes/interview.route.js"));

app.use(function (req, res) {
  res.status(404).json("err: Page not found");
});

app.listen(PORT, () => {
  console.log("app is running on port${} " + PORT);
});
