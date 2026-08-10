import mongoose from "mongoose";
import { InvoiceModel } from "@/databases/Invoice";
import ResponseError from "@/utility/response-error";
import { Request, Response, NextFunction } from "express";

const GET = {
  getInvoiceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.params['id'])) {
        if (!mongoose.Types.ObjectId.isValid(req.params['id']))
          throw new ResponseError(400, "Incorrect invoice id format,", 'invalid_format');
        const invoice = (await InvoiceModel.findById(req.params['id']));
        if (invoice === null)
          throw new ResponseError(404, 'Invoice not found', 'not_found');
        //@ts-ignore
        const { _id, __v, createdAt, updatedAt, ...populatedInvoice } = (await invoice.populate({
          path: "orders.productId",
          select: ["brandName", "productName", "-_id"]
        })).toObject();
        res.status(200).json({ ...populatedInvoice, id: _id.toString() })
      } else throw new ResponseError(400, 'Id not found', 'invalid_format');
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
