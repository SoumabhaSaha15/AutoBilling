import { Request, Response, NextFunction } from "express";
import { lazyLoadingQueryValidator } from '../../validators/lazyLodingQuery.js';
import { ProductModel } from '../../databases/Product.js';
import { ZodError } from "zod/v3";
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
      const { skip, limit, q: textSearchTerm } = lazyLoadingQueryValidator.parse(req.query);
      const finalSkip = skip ?? 0, finalLimit = limit ?? 20, pipeline: any[] = [];
      if (textSearchTerm) pipeline.unshift({ $match: { $text: { $search: textSearchTerm, $caseSensitive: false } } });
      pipeline.push(
        { $skip: finalSkip },
        { $limit: finalLimit },
        { $project: { id: { $toString: "$_id" }, productName: 1, price: 1, productDescription: 1, __v: 1, createdAt: 1, updatedAt: 1, productPublicId: 1, brandName: 1, productImage: 1 } },
        { $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, productPublicId: 0 } }
      );
      const finalRecords = await ProductModel.aggregate(pipeline);
      res.status(200).json(finalRecords);
    } catch (err) {
      next(err);
    }
  }

};
export default GET;
