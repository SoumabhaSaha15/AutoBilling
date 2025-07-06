import chalk from "chalk";
import inquirer from "inquirer"
import fileSelector from "inquirer-file-tree-selection-prompt";
import { validatorFactory } from "../utility/validation-factory.js";
import { AdminValidator, type AdminType } from "./../databases/Admin.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import cloudinaryConfig from "../configurations/cloudinary.js";
import dotenv from 'dotenv';
inquirer.registerPrompt('file', fileSelector);
const main = async () => {
  dotenv.config();
  cloudinaryConfig();
  const data: AdminType = await inquirer.prompt<AdminType>([{
    type: "input",
    name: "name",
    message: chalk.bold.blue("Enter name[4-30 char]: "),
    validate: validatorFactory(AdminValidator.pick({ name: true })),
    prefix: chalk.bold.red("*👤")
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
  data.profilePicture = cloudinary.url(public_id, {
    transformation: [{ fetch_format: 'auto', quality: "auto" }]
  });
  
  fs.writeFile(
    './public/data.admin.json',
    JSON.stringify(AdminValidator.parse(data), null, 2), 
    { encoding: "utf-8" }
  ).then(()=>{
    console.log(chalk.bold.green("done"));
  })
}
main();