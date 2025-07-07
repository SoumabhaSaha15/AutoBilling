import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminModel, AdminValidator } from "../databases/Admin.js";
import express, { Request, Response, NextFunction } from "express";

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
        req.query.id = (payload as JwtPayload)["id"];
        next();
      })();
    } catch (err) {
      next(err);
    }
  },
  adminNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AdminModel.exists({ _id: req.query?.id }) ?
        next() :
        res.status(404).send('No admin found.');
    } catch (err) {
      next(err);
    }
  },
  provideAdminData: async (req: Request, res: Response, next: NextFunction) => {
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

const POST = {
  checkAdminKey: async (req: Request, res: Response, next: NextFunction) => {
    try{
      const adminKey = req.body?.adminKey;
      if(adminKey===process.env.ADMIN_KEY) {
        delete req.body?.adminKey;
        next();
      } else res.status(401).send('Incorrect admin key.');
    }catch(err){
      next(err);
    }
  },
  invalidCredentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = AdminValidator.pick({ email: true, password: true }).parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  },
  userNotFound: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let admin = (await AdminModel.findOne({ email: req.body.email }).exec());
      if (admin) {
        req.body = {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          profilePicture: admin.profilePicture,
          password: req.body?.password,
          hashPassword: admin.password
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
      let data = req.body;
      delete data["password"];
      delete data["hashPassword"];
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
const router = express.Router();
router
  .route('/admin_login')
  .get(
    GET.cookiesNotFound,
    GET.invalidCookies,
    GET.adminNotFound,
    GET.provideAdminData
  )
  .post(
    POST.checkAdminKey,
    POST.invalidCredentials,
    POST.userNotFound,
    POST.wrongCredentials,
    POST.setCookie,
  );
export default router;
