import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmployeeModel, EmployeeValidator } from "../../databases/Employee.js";
import { Request, Response, NextFunction } from "express";
const POST = {
  invalidCredentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      EmployeeValidator
        .pick({ email: true, password: true })
        .parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  },
  userNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let employee = (await EmployeeModel.findOne({ email: req.body.email }).exec());
      if (employee) {
        req.body = {
          id: employee._id.toString(),
          name: employee.name,
          email: employee.email,
          profilePicture: employee.profilePicture,
          password: req.body?.password,
          hashPassword: employee.password
        };
        next();
      } else res.status(404).send('No admin found.');
    } catch (err) {
      next(err);
    }
  },
  wrongCredentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hashResult = bcrypt.compareSync(req.body?.password || '', req.body?.hashPassword);
      if (!hashResult) res.status(400).send("Wrong credential.");
      else next();
    } catch (err) {
      next(err);
    }
  },
  setCookie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const TenYearsFromNow = new Date();
      TenYearsFromNow.setFullYear(TenYearsFromNow.getFullYear() + 10);
      res.cookie('id', jwt.sign({ id: req.body?.id }, process.env.JWT_KEY), {
        httpOnly: true,
        expires: TenYearsFromNow,
      });
      let { password, hashPassword, ...data } = req.body;
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
export default POST;
