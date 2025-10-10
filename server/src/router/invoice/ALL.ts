import { Request, Response, NextFunction } from "express";
const ALL = {
  allowEmployee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'employee') throw new Error('Not an Employee!!!');
      else next();
    } catch (err) {
      next(err);
    }
  }
}
export default ALL;
