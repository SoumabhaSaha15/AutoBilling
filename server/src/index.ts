import express, { Request, Response, NextFunction } from "express";
import zodErrorFlattener from "./utility/zod-error-flattener.js";
import cloudinaryConfig from "./configurations/cloudinary.js";
import { MongoServerError } from "mongodb"
import cookie_parser from "cookie-parser";
import router from "./router/index.js";
import { print } from "running-at";
import { connect } from "mongoose";
import { ZodError } from "zod";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";
import cors from "cors";
try {
  dotenv.config();
  cloudinaryConfig();
  const CONNECTOR = await connect(process.env.DB_URI);
  const APP = express()
    .use(cors({ origin: process.env.CORS_URL,credentials:true }))
    .use(express.static(path.join(import.meta.dirname, "./../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookie_parser())
    .use(async (err: Error, _: Request, res: Response, __: NextFunction) => {
      //error controller.
      if (err instanceof ZodError) res.status(400).send(zodErrorFlattener(err));
      else if (err instanceof MongoServerError) {
        const { keyValue } = err.errorResponse;
        const errorMessage = Object
          .entries(keyValue)
          .map(el => `${el[0]} : ${el[1]} is already in use.`)
          .join(" ");
        res.status(400).send(errorMessage);
      }
      res.status(500).send(err.message);
    })
    .use(router)
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
