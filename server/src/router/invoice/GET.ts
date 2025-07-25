import mongoose from 'mongoose';
import { InvoiceBriefModel } from '../../databases/InvoiceBriefView.js';
import { EmployeeModel } from '../../databases/Employee.js';
import { Request, Response, NextFunction } from "express";
const GET = {
  getAllInvoices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      const employee = await EmployeeModel.findById(req['employeeId']);
      //@ts-check
      const invoices = await InvoiceBriefModel.find({employeeEmail:employee?.email}).sort({ dateTime: -1 });
      res.status(200).json(invoices);
    } catch (err) {
      next(err);
    }
  }
}
export default GET;
