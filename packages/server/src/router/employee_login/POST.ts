import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../../utility/response-error.js";
import validate, { type ValidatedRequest } from "express-zod-safe";
import { EmployeeModel, EmployeeValidator } from "../../databases/Employee.js";

const EmployeeLoginValidator = EmployeeValidator.pick({ email: true, password: true });
type EmployeeLoginRequest = ValidatedRequest<{ body: typeof EmployeeLoginValidator }>;

const POST = {
  invalidCredentials: validate({ body: EmployeeLoginValidator }),
  userNotFound: async (req: EmployeeLoginRequest, res: Response, next: NextFunction) => {
    try {
      let employee = (await EmployeeModel.findOne({ email: req.body.email }).exec());
      if (employee === null)
        throw new ResponseError(404, 'Client not found', 'not_found');
      const hashResult = bcrypt.compareSync(req.body.password, employee.password);
      if (!hashResult)
        throw new ResponseError(400, 'Wrong employee password or email', 'invalid_credentials');

      req.session.clientId = employee._id.toString();
      req.session.clientType = "employee";

      res.status(200).json({
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        profilePicture: employee.profilePicture,
      });

    } catch (err) {
      next(err);
    }
  }
}
export default POST;
