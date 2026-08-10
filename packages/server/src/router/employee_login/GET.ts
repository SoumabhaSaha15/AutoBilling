import mongoose from "mongoose";
import { EmployeeModel } from "@/databases/Employee";
import { Request, Response, NextFunction } from "express";
const GET = {
  cookiesNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session.clientId ? next() : res.status(401).send('Not logged in.');
    } catch (err) {
      next(err);
    }
  },
  invalidCookies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = mongoose.Types.ObjectId.isValid(req.session.clientId || '') && req.session.clientType === 'employee';
      (!result) ? res.status(401).send('Invalid cookies.') : next();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await EmployeeModel.exists({ _id: req.session.clientId }) ? next() : res.status(404).send('No client found.');
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let employee = await EmployeeModel.findById(req.session.clientId);
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
