import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";

import router from "./router";

const allowedOrigins = [
  "http://localhost:5173",
  undefined,
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 204,
}));
app.use(compression());
app.use(bodyParser.json());

let dbConnectionStatus = { status: 0, message: "" };
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false).connect(process.env.MONGODB_URI)
  .then(() => {
    dbConnectionStatus = { status: 200, message: "Alive..." };
    console.log("Database Connected");
  })
  .catch((error) => {
    dbConnectionStatus = { status: 500, message: error }
    console.log("Can't connect to database: \n", error);
  });

app.get("/api", (req, res) => {
  res.status(200).send({
    status: 200,
    message: dbConnectionStatus,
    data: null
  });
});

app.use("/api", router());

app.listen(process.env.PORT, () => {
  console.log(`App Running on: http://localhost:${process.env.PORT}`);
});