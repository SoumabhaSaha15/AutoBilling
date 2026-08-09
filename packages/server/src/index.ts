import cors from "cors";
import path from "path";
import chalk from "chalk";
import dns from 'node:dns';
import dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
import router from "@/router/index";
import cookieParser from "cookie-parser";
import { ZodError, prettifyError } from "zod";
import errorHadler from "@/configurations/error";
import sessionConfig from "@/configurations/session";
import listenCallback from "@/utility/listen-callback";
import cloudinaryConfig from "@/configurations/cloudinary";
import { csrfSynchronisedProtection, csrfTokenMiddleware } from "@/configurations/csrf";
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dotenv.config({ quiet: true });
  console.log(process.env.ADMIN_KEY);
  cloudinaryConfig();
  const CONNECTOR = await connect(process.env.DB_URI);
  const APP = express()
    .use(cors({ origin: process.env.CORS_URL, credentials: true }))
    .use(express.static(path.join(import.meta.dirname, "./../public")))
    .set('query parser', 'extended')
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(sessionConfig())
    .use(csrfTokenMiddleware)
    .use(csrfSynchronisedProtection);

  if (process.env.MODE === 'prod') APP.use('/api', router).get(/^\/(?!api\/).*/, (_, res) => res.sendFile(path.join(import.meta.dirname, '../public/index.html')));
  if (process.env.MODE === 'dev') APP.use(router);

  const SERVER = APP.use(errorHadler).listen(process.env.PORT, listenCallback);

  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. Database disconnected."));
    await CONNECTOR.disconnect();
    SERVER.close(async (error) => {
      if (error) console.log(chalk.red.bold(error.message || "Error during server shutdown."));
      process.exit(0);
    });
  });

} catch (error) {
  if (error instanceof ZodError) console.log(chalk.red.bold(prettifyError(error)))
  else console.log(chalk.red((error as Error).message), error);
  process.exit(0);
}
