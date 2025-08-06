import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel, AdminValidator } from "../../databases/Admin.js";
import { Request, Response, NextFunction } from "express";
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
      let { password, hashPassword, ...data } = req.body;
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
export default POST;
