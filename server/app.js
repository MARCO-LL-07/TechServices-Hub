const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*", // en producción pones tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

module.exports = app;