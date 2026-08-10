import { EmployeeModel } from '@/databases/Employee';
import { Request, Response, NextFunction } from "express";
import { InvoiceValidator, InvoiceModel } from '@/databases/Invoice';
const POST = {
  invalidOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await EmployeeModel.findById(req.session.clientId);
      const invoice = (await InvoiceModel.create(InvoiceValidator.parse({
        employeeEmail: employee?.email,
        dateTime: (new Date()).toISOString(),
        ...req.body
      })))
      //@ts-ignore
      const { _id } = invoice.toObject();
      res.status(201).json({ id: _id.toString() });
    } catch (err) {
      next(err);
    }
  }
}
export default POST;
