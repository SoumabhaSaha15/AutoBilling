import { EmployeeModel } from "../databases/Employee.js";
import { Request, Response, NextFunction } from "express";
import { AdminModel } from "../databases/Admin.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
const routesValidator = z.array(z.string().startsWith('/'));
export default (unauthRoutes: z.infer<typeof routesValidator>): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  const { success, error } = routesValidator.safeParse(unauthRoutes);
  if (!success) throw error;
  return async (req: Request, _: Response, next: NextFunction) => {
    if (unauthRoutes.includes(req.url)) return next();
    try {
      if (!req.cookies['id']) throw new Error('Client not logged in');
      const clientId = (jwt.verify(req.cookies['id'], process.env.JWT_KEY!) as JwtPayload)['id'];
      if (!mongoose.Types.ObjectId.isValid(clientId)) throw new Error("Invalid cookie");
      req.clientType = (await AdminModel.exists({ _id: clientId })) ? "admin" : ((await EmployeeModel.exists({ _id: clientId })) ? "employee" : null);
      if (req.clientType === null) {
        req.clientId = null;
        throw new Error('Invalid client');
      }
      req.clientId = clientId;
      next();
    } catch (err) {
      next(err);
    }
  }
}
