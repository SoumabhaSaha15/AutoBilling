import mongoose from "mongoose";
import ResponseError from "../../../utility/response-error.js";
import { Request, Response, NextFunction } from "express";
import { InvoiceModel} from "../../../databases/Invoice.js";
const GET = {
  getInvoiceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params['id']) {
        if (!mongoose.Types.ObjectId.isValid(req.params['id'])) throw new ResponseError(400,"Incorrect invoice id format,",'Invalid id param');
        const invoice = (await InvoiceModel.findById(req.params['id']));
        if (invoice === null) throw new ResponseError(404,'Invoice not found','Data not found.');
        //@ts-ignore
        const { _id, __v, createdAt, updatedAt, ...populatedInvoice } = (await invoice.populate({
          path: "orders.productId",
          select: ["brandName", "productName", "-_id"]
        })).toObject();
        //@ts-check
        res.status(200).json({ ...populatedInvoice, id: _id.toString() })
      } else throw new ResponseError(400,'Id not found','Params mismatch');
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
