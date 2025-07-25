import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AdminModel } from '../../databases/Admin.js';
import { Request, Response, NextFunction } from "express";
import { lazyLoadingQueryValidator } from '../../validators/lazyLodingQuery.js';
import { ProductModel } from './../../databases/Product.js';
const GET = {
  notAnAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.cookies['id']) {
        let payload: string | JwtPayload = jwt.verify(req.cookies['id'] || '', process.env.JWT_KEY);
        if ((payload as JwtPayload)['iat']) delete (payload as JwtPayload)['iat'];
        const adminId = (payload as JwtPayload)["id"];
        if (!mongoose.Types.ObjectId.isValid(adminId)) throw new Error("Invalid cookie");
        if (await AdminModel.exists({ _id: adminId })) next();
        else throw new Error("Not an admin");
      } else res.status(401).send('admin not logged in.');
    } catch (err) {
      next(err);
    }
  },
  sendData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { skip, limit } = lazyLoadingQueryValidator.parse(req.query);
      (skip === undefined) && (skip = 0);
      (limit === undefined) && (limit = 20);
      const records = (await ProductModel
        .find()
        .skip(skip)
        .limit(limit)
      ).map(record => {
        //@ts-ignore
        const { __v, createdAt, updatedAt, _id,...data } = record.toJSON();
        //@ts-check
        return {id:_id.toString(),...data};
      });
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  }
};
export default GET;
