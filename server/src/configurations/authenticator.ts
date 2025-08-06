import { EmployeeModel } from "../databases/Employee.js";
import { Request, Response, NextFunction } from "express";
import { AdminModel } from "../databases/Admin.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
const routesValidator = z.array(z.string().startsWith('/'));
type ClientData = {
  clientId: string | null;
  clientType: 'employee' | 'admin' | null;
};
const allowWithoutAuth = (unauthRoutes: z.infer<typeof routesValidator>): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  const { success, error } = routesValidator.safeParse(unauthRoutes);
  if (!success) throw error;
  return async (req: Request, _: Response, next: NextFunction) => {
    if (unauthRoutes.includes(req.url)) return next();
    try {
      if (!req.cookies['id']) throw new Error('client not logged in');
      const clientId = (jwt.verify(req.cookies['id'], process.env.JWT_KEY) as JwtPayload)['id'];
      if (!mongoose.Types.ObjectId.isValid(clientId)) throw new Error("Invalid cookie");
      const clientData: ClientData = await AdminModel.exists({ _id: clientId }) ? ({ clientId: clientId, clientType: "admin" }) : (
        (await EmployeeModel.exists({ _id: clientId })) ? ({ clientId: clientId, clientType: "employee" }) : ({ clientId: null, clientType: null })
      );
      req.clientId = clientData.clientId;
      req.clientType = clientData.clientType;
      if(req.clientType == null) throw new Error('Invalid client!!!');
      next();
    } catch (err) {
      next(err);
    }
  }
}
export default allowWithoutAuth;
