import cookie_parser from "cookie-parser";
import { print } from "running-at";
import { connect } from "mongoose";
import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";

try {
  dotenv.config();
  const CONNECTOR = await connect(process.env.DB_URI);
  const DB = CONNECTOR.connection.db;
  const APP = express()
    .use(express.static(path.join(import.meta.dirname, "./../public")))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookie_parser())
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