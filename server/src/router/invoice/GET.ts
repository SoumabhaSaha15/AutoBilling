import mongoose from 'mongoose';
import { InvoiceModel } from '../../databases/Invoice.js';
import { Request, Response, NextFunction } from "express";
const GET = {
  findOrder: async (req: Request, res: Response, next: NextFunction) => {
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
        res.status(200).json({...populatedInvoice,id:_id.toString()})
      } else res.status(401).send('invalid route params');
    } catch (err) {
      next(err);
    }
  }
}
export default GET;
