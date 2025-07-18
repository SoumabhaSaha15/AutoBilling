import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmployeeModel } from '../../databases/Employee.js';
import { Request, Response, NextFunction } from "express";
import { InvoiceValidator, InvoiceModel, InvoiceType } from '../../databases/Invoice.js';
const POST = {
  notAnEmployee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.cookies['id']) {
        let payload: string | JwtPayload = jwt.verify(req.cookies['id'] || '', process.env.JWT_KEY);
        if ((payload as JwtPayload)['iat']) delete (payload as JwtPayload)['iat'];
        const adminId = (payload as JwtPayload)["id"];
        if (!mongoose.Types.ObjectId.isValid(adminId)) throw new Error("Invalid cookie");
        if (await EmployeeModel.exists({ _id: adminId })) {
          //@ts-ignore
          req['employeeId'] = adminId;
          //@ts-check
          next();
        }
        else throw new Error("Not an employee");
      } else res.status(401).send('admin not logged in.');
    } catch (err) {
      next(err);
    }
  },
  invalidOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      const employee = await EmployeeModel.findById(req['employeeId']);
      //@ts-check
      const invoice = (await InvoiceModel.create(InvoiceValidator.parse({
        employeeEmail: employee?.email,
        dateTime: (new Date()).toISOString(),
        ...req.body,
      })))
      //@ts-ignore
      const { _id } = invoice.toObject();
      res.status(200).json({ id: _id.toString() });
    } catch (err) {
      next(err);
    }
  }
}
export default POST;
