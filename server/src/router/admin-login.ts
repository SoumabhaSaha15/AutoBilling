import express from "express";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminModel, AdminValidator } from "../databases/Admin";

const GET: Record<string, (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>> = {
  cookiesNotFound: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.cookies['id'] ? next() : res.status(401).send('not logged in');
    } catch (err) {
      next(err);
    }
  },
  invalidCookies: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let payload: string | JwtPayload = jwt.verify(req.cookies['id'] || '', process.env.JWT_KEY);
      if ((payload as JwtPayload)['iat']) delete (payload as JwtPayload)['iat'];
      const result = mongoose.Types.ObjectId.isValid((payload as JwtPayload)["id"]);
      (!result) ? res.status(401).send('invalid cookies.') : (() => {
        req.query.id = (payload as JwtPayload)["id"];
        next();
      })();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await AdminModel.exists({ _id: req.query?.id }) ?
        next() :
        res.status(404).send('no admin found');
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let admin = await AdminModel.findById(req.query?.id);
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
const POST: Record<string, (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>> = {
  invalidCredentials: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.query = AdminValidator.parse(req.query);
      next();
    } catch (e) {
      next(e);
    }
  }
}
const router = express.Router();
router
  .route('/admin-login')
  .get(
    GET.cookiesNotFound,
    GET.invalidCookies,
    GET.adminNotFound,
    GET.provideAdminData
  )
  .post(
  // POST.invalidLoginCredentials,
  // POST.userNotFound,
  // POST.wrongCredentials,
  // POST.setCookie,
  // POST.redirectToUser
);
export default router;