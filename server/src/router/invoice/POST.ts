import { EmployeeModel } from '../../databases/Employee.js';
import { Request, Response, NextFunction } from "express";
import { InvoiceValidator, InvoiceModel } from '../../databases/Invoice.js';
const POST = {
  notAnEmployee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      (req.session.clientType === 'employee') ? next() : res.status(401).send('Not an employee');
    } catch (err) {
      next(err);
    }
  },
  invalidOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await EmployeeModel.findById(req.session.clientId);
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
