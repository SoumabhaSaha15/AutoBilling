import { ProductModel } from "../databases/Product.js";
import mongoose from "mongoose";
import chalk from "chalk";

const update = async () => {
  (await import("dotenv")).config();
  const CONNECTOR = await mongoose.connect(process.env.DB_URI);
  console.log(chalk.blue.bold.italic('Updating...'));
  await ProductModel.updateMany({}, {
    $unset: { productDescription: "" },
    $set: { productQuantity: 500 }
  }, { strict: false }).exec();
  console.log(chalk.blue.bold.italic('Updating done'));
  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. MongoDB disconnected."));
    await CONNECTOR.disconnect();
    process.exit(0);
  });
}
await update();
