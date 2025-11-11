import mongoose from "mongoose";
import { AdminModel } from "../../databases/Admin.js";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../../utility/response-error.js";
const GET = {
  cookiesNotFound: async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (!req.session.clientId)
        throw new ResponseError(401, 'Admin not logged in.', 'client_unauthenticated');
      next();
    } catch (err) {
      next(err);
    }
  },
  invalidCookies: async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (!(mongoose.Types.ObjectId.isValid(req.session?.clientId || '') && req.session.clientType === "admin"))
        throw new ResponseError(403, 'Invalid cookie.', 'client_unauthorised');
      next();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (!(await AdminModel.exists({ _id: req.session.clientId })))
        throw new ResponseError(404, 'Admin not found.', 'not_found');
      next();
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let admin = await AdminModel.findById(req.session.clientId);
      if (!admin)
        throw new Error('error at provideAdminData', { cause: 'failed to fetch admin' });
      return void res.status(200).json({
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        profilePicture: admin.profilePicture
      });
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
