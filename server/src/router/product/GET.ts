import { Request, Response, NextFunction } from "express";
import { lazyLoadingQueryValidator } from '../../validators/lazyLodingQuery.js';
import { ProductModel } from './../../databases/Product.js';
const GET = {
  notAnAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'admin') throw new Error('You are not an admin');
      next();
    } catch (err) {
      next(err);
    }
  },
  sendData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { skip, limit, q } = lazyLoadingQueryValidator.parse(req.query);
      (skip === undefined) && (skip = 0);
      (limit === undefined) && (limit = 20);
      const records = await ProductModel.aggregate([
        { $skip: skip }, { $limit: limit },
        {
          $project: {
            id: { $toString: "$_id" },
            productName: 1,
            price: 1,
            productDescription: 1,
            __v: 1,
            createdAt: 1,
            updatedAt: 1,
            productPublicId: 1,
            brandName: 1,
            productImage: 1
          }
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            productPublicId: 0
          }
        }
      ]);
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  },

};
export default GET;
