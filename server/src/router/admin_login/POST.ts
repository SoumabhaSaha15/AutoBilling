import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../../utility/response-error.js";
import { AdminModel, AdminValidator } from "../../databases/Admin.js";
const POST = {
  checkAdminKey: async (req: Request, _: Response, next: NextFunction) => {
    try {
      const adminKey = req.body?.adminKey;
      if (adminKey !== process.env.ADMIN_KEY)
        throw new ResponseError(400, "Incorrect admin key", "invalid_credentials");
      delete req.body?.adminKey;
      next();
    } catch (err) {
      next(err);
    }
  },
  invalidCredentials: async (req: Request, _: Response, next: NextFunction) => {
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
      if (admin === null)
        throw new ResponseError(404, 'Admin not found', 'not_found');
      const hashResult = bcrypt.compareSync(req.body.password||'', admin.password);
      if (!hashResult)
        throw new ResponseError(400, 'Admin not found', 'invalid_credentials');
      req.body = {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        profilePicture: admin.profilePicture
      };
      next();
    } catch (err) {
      next(err);
    }

  },
  setCookie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session.clientId = req.body.id;
      req.session.clientType = "admin";
      res.status(200).json(req.body);
    } catch (err) {
      next(err);
    }
  }
}
export default POST;
