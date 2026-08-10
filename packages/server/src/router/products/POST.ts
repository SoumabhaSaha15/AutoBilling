import fs from 'node:fs/promises';
import multer from "@/configurations/multer"
import { v2 as cloudinary } from 'cloudinary';
import ResponseError from '@/utility/response-error';
import { Request, Response, NextFunction } from "express";
import { ProductModel, ProductValidator } from '@/databases/Product.js';

const POST = {
  uploadFile: multer.single('productImage'),
  notAnAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'admin') {
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        throw new ResponseError(403, "Not an admin", 'client_unauthorised');
      } else next();
    } catch (err) {
      (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      next(err);
    }
  },
  invalidDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = ProductValidator.omit({ productImage: true, productPublicId: true });
      req.body = validator.parse(req.body);
      if (req.file?.path) {
        const { public_id } = await cloudinary.uploader.upload(req.file?.path, { folder: process.env.CLOUDINARY_PRODUCT_DIR })
        const link = cloudinary.url(public_id, {
          transformation: [{
            fetch_format: 'auto',
            quality: "auto",
            width: 720,
            height: 720
          }]
        });
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        req.body = ProductValidator.parse({ ...req.body, productImage: link, productPublicId: public_id });
        next();
      } else throw new Error('no image uploaded!');
    } catch (e) {
      next(e);
    }
  },
  sendData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductModel.create(req.body);
      //@ts-ignore
      const { _id, __v, createdAt, updatedAt, productPublicId, ...data } = product.toJSON();
      res.status(201).json({ ...data, id: _id.toString() });
    } catch (e) {
      (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      next(e);
    }
  },
};
export default POST;
