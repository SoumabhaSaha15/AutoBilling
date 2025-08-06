import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { EmployeeModel } from "../../databases/Employee.js";
import { Request, Response, NextFunction } from "express";
const GET = {
  cookiesNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.cookies['id'] ? next() : res.status(401).send('Not logged in.');
    } catch (err) {
      next(err);
    }
  },
  invalidCookies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload: string | JwtPayload = jwt.verify(req.cookies['id'] || '', process.env.JWT_KEY);
      if ((payload as JwtPayload)['iat']) delete (payload as JwtPayload)['iat'];
      const result = mongoose.Types.ObjectId.isValid((payload as JwtPayload)["id"]);
      (!result) ? res.status(401).send('Invalid cookies.') : (() => {
        req.clientId = (payload as JwtPayload)["id"];
        req.clientType = 'employee';
        next();
      })();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await EmployeeModel.exists({ _id: req.clientId }) ?
        next() :
        res.status(404).send('No client found.');
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let employee = await EmployeeModel.findById(req.clientId);
      if (employee) res.status(200).json({
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        profilePicture: employee.profilePicture
      });
      else throw new Error('error at provideAdminData', { cause: 'failed to fetch admin' });
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
