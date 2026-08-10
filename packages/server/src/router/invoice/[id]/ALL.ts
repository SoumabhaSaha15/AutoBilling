import ResponseError from "@/utility/response-error";
import { Request, Response, NextFunction } from "express";

const ALL = {
  allowEmployee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.clientType !== 'employee')
        throw new ResponseError(403, 'Client is not an employee.', "client_unauthorised");
      next();
    } catch (err) {
      next(err);
    }
  }
}
export default ALL;
