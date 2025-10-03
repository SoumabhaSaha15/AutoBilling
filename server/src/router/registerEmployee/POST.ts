import fs from 'node:fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import multer from "../../configurations/multer.js"
import { Request, Response, NextFunction } from "express";
import { EmployeeModel, EmployeeValidator } from '../../databases/Employee.js';
const POST = {
  uploadFile: multer.single('profilePicture'),
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
  invalidDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = EmployeeValidator.omit({ profilePicture: true });
      req.body = validator.parse(req.body);
      if (req.file?.path) {
        const { public_id } = await cloudinary.uploader.upload(req.file?.path, { folder: process.env.CLOUDINARY_EMPLOYEE_DIR })
        const link = cloudinary.url(public_id, {
          transformation: [{
            fetch_format: 'auto',
            quality: "auto",
            width: 720,
            height: 720
          }]
        });
        (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
        req.body = EmployeeValidator.parse({ ...req.body, profilePicture:link });
        next();
      } else {
        throw new Error('no image uploaded!');
      }
    } catch (e) {
      next(e);
    }
  },
  sendData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await EmployeeModel.create(req.body);
      //@ts-ignore
      const { _id, __v, password, createdAt, updatedAt, ...data } = employee.toJSON();
      res.status(200).json({ ...data, id: _id.toString() });
    } catch (e) {
      (req.file?.path) && (await fs.unlink(req.file.path).catch(console.error));
      next(e);
    }
  },
};
export default POST;
