import { ProductModel } from '../../databases/Product.js';
import { Request, Response, NextFunction } from "express";
import { lazyLoadingQueryValidator } from '../../validators/lazyLodingQuery.js';
import { ProductFinder } from '../../validators/productFilter.js';
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
      const { q: textSearchTerm, page } = lazyLoadingQueryValidator.parse(req.query);
      console.log(ProductFinder.safeParse(req.query));
      const query: any = textSearchTerm ? { $text: { $search: textSearchTerm, $caseSensitive: false } } : {};
      const { docs, ...data } = await ProductModel.paginate(query, {
        page,
        select: "-__v -createdAt -updatedAt -productPublicId",
        lean: true
      });
      res.status(200).json({ ...data, docs: docs.map(({ _id, productQuantity, ...productData }) => productData) });
    } catch (err) {
      next(err);
    }
  }

};
export default GET;
