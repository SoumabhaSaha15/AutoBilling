import ip from "ip";
import chalk from "chalk";
import boxen from "boxen";
export default (err: Error | undefined) => {
  if (err) console.error(err);
  process.on(
    "unhandledRejection",
    (reason) => console.log(chalk.red.bold("Unhandled Rejection:\n"), reason)
  );
  console.log(
    boxen(chalk.blue(
      `Server is running!\n-Local:   http://localhost:${process.env.PORT}\n-Network: http://${ip.address()}:${process.env.PORT}`
    ), { padding: 1, borderColor: "blue", title: process.env.MODE })
  );
};
