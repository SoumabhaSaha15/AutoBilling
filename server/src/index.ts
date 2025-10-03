import allowWithoutAuth from "./configurations/sessionAuthenticator.js";
import cloudinaryConfig from "./configurations/cloudinary.js";
import sessionConfig from "./configurations/session.js";
import errorHadler from "./configurations/error.js";
import cookieParser from "cookie-parser";
import router from "./router/index.js";
import { print } from "running-at";
import { connect } from "mongoose";
import express from "express";
import dotenv from "dotenv";
import lusca from "lusca";
import chalk from "chalk";
import path from "path";
import cors from "cors";

try {
  dotenv.config();
  cloudinaryConfig();
  const CONNECTOR = await connect(process.env.DB_URI);
  const APP = express()
    .use(cors({ origin: process.env.CORS_URL, credentials: true }))
    .use(express.static(path.join(import.meta.dirname, "./../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(sessionConfig())
    .use(lusca({ csrf: true, xssProtection: true, xframe: "SAMEORIGIN" }))
    .use(allowWithoutAuth(['/admin_login', '/employee_login','/get-csrf-token']))
    .use(router)
    .use(errorHadler)
    .listen(process.env.PORT, () => print(process.env.PORT));
  process.on("unhandledRejection", (reason) => {
    console.log(chalk.red.bold("Unhandled Rejection:"), '\n', reason);
  });

  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. MongoDB disconnected."));
    await CONNECTOR.disconnect();
    APP.close(async (error) => {
      if (error) console.log(chalk.red.bold(error.message || "Error during server shutdown."));
      process.exit(0);
    });
  });
} catch (error) {
  console.log(chalk.red.bold((error as Error).message));
}
