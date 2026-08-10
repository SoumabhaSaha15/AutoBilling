import { EmployeeModel } from '@/databases/Employee';
import { Request, Response, NextFunction } from "express";
import { InvoiceBriefModel } from '@/databases/InvoiceBriefView';

const GET = {
  getAllInvoices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await EmployeeModel.findById(req.session.clientId);
      const invoices = await InvoiceBriefModel.find({ employeeEmail: employee?.email }).sort({ dateTime: -1 });
      res.status(200).json(invoices);
    } catch (err) {
      next(err);
    }
  }
}

export default GET;
