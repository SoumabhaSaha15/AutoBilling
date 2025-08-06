import express from "express";
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";
import GET from "./GET.js"
import { InvoiceModel} from '../../databases/Invoice.js';
import POST from "./POST.js";
const router = express.Router();
const isEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.clientType!=='employee') throw new Error('Not an Employee!!!');
    else next();
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
