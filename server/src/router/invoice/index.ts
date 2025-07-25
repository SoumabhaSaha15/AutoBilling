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
      const employeeId = (payload as JwtPayload)["id"];
      if (!mongoose.Types.ObjectId.isValid(employeeId)) throw new Error("Invalid cookie");
      if (await EmployeeModel.exists({ _id: employeeId })) {
        //@ts-ignore
        req['employeeId'] = employeeId;
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
  .get(GET.getAllInvoices)
  .post(POST.invalidOrders);
router.get('/invoice/:id', isEmployee, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params['id']) {
      if (!mongoose.Types.ObjectId.isValid(req.params['id'])) throw new Error("Invalid params");
      const invoice = (await InvoiceModel.findById(req.params['id']));
      if (invoice === null) throw new Error('No invoice Found');
      //@ts-ignore
      const { _id, __v, createdAt, updatedAt, ...populatedInvoice } = (await invoice.populate({
        path: "orders.productId",
        select: ["price", "brandName", "productName", "-_id"]
      })).toObject();
      //@ts-check
      res.status(200).json({ ...populatedInvoice, id: _id.toString() })
    } else res.status(401).send('invalid route params');
  } catch (err) {
    next(err);
  }
});
export default router;
