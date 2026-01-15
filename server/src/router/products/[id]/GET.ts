import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../../databases/Product.js";
export default {
  notAnAdmin: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'admin') throw new Error('You are not an admin');
      next();
    } catch (err) {
      next(err);
    }
  },
  sendProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = req.params['id'];
      if (!mongoose.Types.ObjectId.isValid(param as string)) return void res.status(400).send(`Invalid product id ${param}.`);
      const productDoc = await ProductModel.findById(param).exec();
      if (productDoc === null) return void res.status(404).send(`No such product with id: ${param}.`);
      //@ts-ignore
      const { _id, __v, productPublicId, createdAt, updatedAt, ...product } = productDoc.toObject();
      res.status(200).json({ ...product, id: _id });
    } catch (err) {
      next(err);
    }
  }
}
