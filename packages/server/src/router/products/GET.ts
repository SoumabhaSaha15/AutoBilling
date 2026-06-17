import { ProductModel } from '../../databases/Product.js';
import { Request, Response, NextFunction } from "express";
import { ProductQueryTransformer } from '../../validators/productFilter.js';
const GET = {
  notAnAdmin: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'admin') throw new Error('You are not an admin');
      next();
    } catch (err) {
      next(err);
    }
  },
  sendData: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { queryBuilder, page } = ProductQueryTransformer.parse(req.query);
      const data = await ProductModel.aggregatePaginate(
        ProductModel.aggregate([
          queryBuilder,
          { $addFields: { id: "$_id" } },
          { $project: { _id: 0, __v: 0, productPublicId: 0, productQuantity: 0, createdAt: 0, updatedAt: 0 } },
        ]),
        { page });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

};
export default GET;
