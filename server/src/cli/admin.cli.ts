import chalk from "chalk";
import dotenv from "dotenv";
import figlet from "figlet";
import inquirer from "inquirer"
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "../configurations/cloudinary.js";
import fileSelector from "inquirer-file-tree-selection-prompt";
import { validatorFactory } from "../utility/validation-factory.js";
import { AdminModel, AdminValidator, type AdminType } from "./../databases/Admin.js";

inquirer.registerPrompt('file', fileSelector);
const main = async () => {
  dotenv.config();
  cloudinaryConfig();
  const CONNECTOR = await mongoose.connect(process.env.DB_URI);
  const DB = CONNECTOR.connection.db;

  console.log(
    chalk.blue(
      figlet.textSync(
        'Admin  Portal  CLI.',
        { font: "Banner3", whitespaceBreak: true, }
      )
    )
  );

  const data: AdminType = await inquirer.prompt<AdminType>([{
    type: "input",
    name: "name",
    message: chalk.bold.blue("Enter name[4-30 char]: "),
    validate: validatorFactory(AdminValidator.pick({ name: true })),
    prefix: chalk.bold.red("*👑")
  }, {
    type: "input",
    name: "email",
    message: chalk.bold.blue("Enter email: "),
    validate: validatorFactory(AdminValidator.pick({ email: true })),
    prefix: chalk.bold.red("*📧")
  }, {
    type: "password",
    name: "password",
    message: chalk.bold.blue("Enter password[8]: "),
    validate: validatorFactory(AdminValidator.pick({ password: true })),
    mask: "*",
    prefix: chalk.bold.red("*🔐"),
  }, {
    type: "file",
    name: "profilePicture",
    message: chalk.bold.blue("choose profile-picture:"),
    root: './public/images',
    prefix: chalk.bold.red("*📷"),
  }]);

  const { public_id } = await cloudinary.uploader.upload(data.profilePicture, {
    folder: process.env.CLOUDINARY_ADMIN_DIR
  });
  data.profilePublicId = public_id;
  data.profilePicture = cloudinary.url(public_id, {
    transformation: [{
      fetch_format: 'auto',
      quality: "auto",
      width: 720,
      height: 720
    }]
  });
  let admin = await AdminModel.create(data);
  console.log(admin.toObject());
  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. MongoDB disconnected."));
    await CONNECTOR.disconnect();
    process.exit(0);
  });
}
main().catch(console.error);
