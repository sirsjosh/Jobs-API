require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const ConnectDB = require("./DB/connection");
const notFound = require("./middleware/notFound");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const authMiddlware = require("./middleware/authentication");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</><a href="/api-docs">Documentation<a/>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddlware, jobRouter);
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = () => {
  try {
    ConnectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
