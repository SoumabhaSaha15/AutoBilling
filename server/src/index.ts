import cors from "cors";
import path from "path";
import chalk from "chalk";
import lusca from "lusca";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
import { print } from "running-at";
import router from "./router/index.js";
import cookieParser from "cookie-parser";
import { ZodError as v3Error } from "zod/v3";
import errorHadler from "./configurations/error.js";
import sessionConfig from "./configurations/session.js";
import { ZodError as v4Error, prettifyError } from "zod/v4";
import cloudinaryConfig from "./configurations/cloudinary.js";
import allowWithoutAuth from "./configurations/sessionAuthenticator.js";
try {
  dotenv.config({ quiet: true });
  cloudinaryConfig();
  const CONNECTOR = await connect(process.env.DB_URI);

  const APP = express()
    .use(morgan(':method :url :status :res[content-length] - :response-time ms'))
    .use(cors({ origin: process.env.CORS_URL, credentials: true }))
    .use(express.static(path.join(import.meta.dirname, "./../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(sessionConfig())
    .use(lusca({ csrf: true, xssProtection: true, xframe: "SAMEORIGIN" }))
    .use(allowWithoutAuth(['/admin_login', '/employee_login', '/get_csrf_token']))
    .use(router)
    .use(errorHadler)
    .listen(process.env.PORT, () => {
      process.on("unhandledRejection", (reason) => console.log(chalk.red.bold("Unhandled Rejection:"), '\n', reason));
      print(process.env.PORT);
    });

  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. Database disconnected."));
    await CONNECTOR.disconnect();
    APP.close(async (error) => {
      if (error) console.log(chalk.red.bold(error.message || "Error during server shutdown."));
      process.exit(0);
    });
  });

} catch (error) {
  if (error instanceof v3Error || error instanceof v4Error) console.log(chalk.red.bold(prettifyError(error)))
  else console.error(error);
}
