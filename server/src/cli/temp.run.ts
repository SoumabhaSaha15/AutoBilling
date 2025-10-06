import { EmployeeModel } from "../databases/Employee.js";
import chalk from "chalk";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const update = async () => {
  const CONNECTOR = await mongoose.connect(process.env.DB_URI);
  console.log(chalk.blue.bold.italic('Updating...'));
  await EmployeeModel.updateMany(
    { profilePublicId: { $exists: false } },
    { $set: { profilePublicId: 'publicid' } }
  ).exec();
  console.log(chalk.blue.bold.italic('Updating done'));
  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. MongoDB disconnected."));
    await CONNECTOR.disconnect();
    process.exit(0);
  });
}
await update();
