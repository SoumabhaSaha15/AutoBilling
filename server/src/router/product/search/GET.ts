import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../../databases/Product.js";
import { FinderFilter } from "../../../validators/productFilter.js";
const GET = {
  searchProduct: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter = FinderFilter.parse(req.query);
      const result = await ProductModel.find(filter);
      if (Object.keys(filter).length == 0) {
        res.status(200).json([]);
        return;
      }
      res.status(200).json(result.map(record => {
        //@ts-ignore
        const { __v, createdAt, updatedAt, _id, ...data } = record.toJSON();
        return { id: _id.toString(), ...data };
      }));
    } catch (error) {
      next(error);
    }
  }
}
export default GET;
