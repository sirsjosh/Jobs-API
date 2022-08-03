const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload._id, name: payload.name };
    next();
  } catch (error) {
    throw res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User unauthorized" });
  }
};

module.exports = auth;
