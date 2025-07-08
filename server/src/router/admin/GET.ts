import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminModel } from "../../databases/Admin.js";
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
        //@ts-ignore
        req['adminId'] = (payload as JwtPayload)["id"];
        next();
      })();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      await AdminModel.exists({ _id: req['adminId'] }) ?
        next() :
        res.status(404).send('No admin found.');
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      let admin = await AdminModel.findById(req['adminId']);
      if (admin) res.status(200).json({
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        profilePicture: admin.profilePicture
      });
      else throw new Error('error at provideAdminData', { cause: 'failed to fetch admin' });
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
