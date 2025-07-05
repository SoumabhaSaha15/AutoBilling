import chalk from "chalk";
import inquirer from "inquirer"
import { AdminValidator, type AdminType } from "./../databases/Admin.js";
inquirer.prompt([{
  name: "name",
  type: "input",
  message: chalk.bold.blue("Enter name [4-30]char : "),
  validate: (value) => {
    const { success, error } = AdminValidator.pick({ name: true }).safeParse({ name: value });
    return success ? success : error.message;
  },
}, {
  name: "email",
  type: "input",
  message: chalk.bold.blue("Enter email: "),
  validate: (value) => {
    const { success, error } = AdminValidator.pick({ email: true }).safeParse({ email: value });
    return success ? success : error.message;
  },
}
]).then(console.log)