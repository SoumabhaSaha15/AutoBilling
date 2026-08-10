import express from "express";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import { v2 as cloudinary } from 'cloudinary';
import multer from "@/configurations/multer";
import { Request, Response, NextFunction } from "express";
import { ProductModel, ProductValidator } from "@/databases/Product";

const PATCH = {
  uploadFile: multer.single('productImage'),
  notAnAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'admin') {
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        throw new Error("Not an admin");
      } else next();
    } catch (err) {
      (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      next(err);
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = req.params['id'];
      if (!mongoose.Types.ObjectId.isValid(param as string)) {
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        return void res.status(400).send(`Invalid product id ${param}.`);
      }
      const productDoc = await ProductModel.findById(param).exec();
      if (productDoc === null) {
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        return void res.status(404).send(`No such product with id: ${param}.`);
      }
      const validator = ProductValidator.omit({ productImage: true, productPublicId: true });
      const updateValues = validator.parse(req.body)
      if (req.file) {
        const { public_id } = await cloudinary.uploader.upload(req.file?.path, { folder: process.env.CLOUDINARY_PRODUCT_DIR })
        const link = cloudinary.url(public_id, {
          transformation: [{
            fetch_format: 'auto',
            quality: "auto",
            width: 720,
            height: 720
          }]
        });
        await cloudinary.uploader.destroy(productDoc.productPublicId);
        await ProductModel.findByIdAndUpdate(
          param,
          { $set: { ...updateValues, productImage: link, productPublicId: public_id } },
          { new: true, runValidators: true }
        );
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      } else {
        await ProductModel.findByIdAndUpdate(
          param,
          { $set: { ...updateValues } },
          { new: true, runValidators: true }
        );
      }
      return void res.status(204).send();
    } catch (error) {
      (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      next(error);
    }

  }
}
export default PATCH;
