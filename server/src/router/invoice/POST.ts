import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmployeeModel } from '../../databases/Employee.js';
import { Request, Response, NextFunction } from "express";
import { InvoiceValidator, InvoiceModel, InvoiceType } from '../../databases/Invoice.js';
const POST = {
  notAnEmployee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(req.clientType==='employee')next()
      else res.status(401).send('Not an employee');
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
