import z from "zod";
import bcrypt from "bcrypt";
import { Response, NextFunction } from "express";
import ResponseError from "../../utility/response-error.js";
import validate, { type ValidatedRequest } from "express-zod-safe";
import { AdminModel, AdminValidator } from "../../databases/Admin.js";

const AdminLoginValidator = AdminValidator
  .pick({ email: true, password: true })
  .extend({
    adminKey: z.literal(process.env.ADMIN_KEY || "admin_key_placeholder", { error: "Incorrect admin key." })
  });
type AdminLoginRequest = ValidatedRequest<{ body: typeof AdminLoginValidator }>;

const POST = {

  invalidCredentials: validate({ body: AdminLoginValidator }),
  userNotFound: async (req: AdminLoginRequest, res: Response, next: NextFunction) => {
    console.log(req.body);

    try {
      let admin = (await AdminModel.findOne({ email: req.body.email }).exec());
      if (admin === null)
        throw new ResponseError(404, 'Admin not found', 'not_found');
      const hashResult = bcrypt.compareSync(req.body.password || '', admin.password);
      if (!hashResult)
        throw new ResponseError(400, 'Wrong admin password or email', 'invalid_credentials');


      req.session.clientId = admin._id.toString();
      req.session.clientType = "admin";

      res.status(200).json({
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        profilePicture: admin.profilePicture
      });

    } catch (err) {
      next(err);
    }
  },
}
export default POST;
