import express from "express";
import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmployeeModel } from '../../databases/Employee.js';
import { Request, Response, NextFunction } from "express";
import GET from "./GET.js"
import { InvoiceValidator, InvoiceModel, InvoiceType } from '../../databases/Invoice.js';
import POST from "./POST.js";
const router = express.Router();
const isEmployee = async (req: Request, res: Response, next: NextFunction) => {
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
    } else res.status(401).send('Employee not logged in.');
  } catch (err) {
    next(err);
  }
}
router
  .route('/invoice')
  .all(isEmployee)
  .post(POST.invalidOrders);
router.get('/invoice/:id',isEmployee,GET.findOrder);
export default router;
