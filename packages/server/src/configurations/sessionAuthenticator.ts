import { z } from "zod";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const routesValidator = z.array(z.string().startsWith('/'));

export default (unauthRoutes: z.infer<typeof routesValidator>): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  const { success, error } = routesValidator.safeParse(unauthRoutes);
  if (!success) throw error;
  return async (req: Request, res: Response, next: NextFunction) => {
    if (unauthRoutes.includes(req.url)) return next();
    try {
      const { clientId, clientType } = req.session;
      if (!(clientId && mongoose.Types.ObjectId.isValid(clientId) && clientType)) {
        req.session.destroy((error) => {
          (error) ? res.status(401).send("Invalid Session.") : res.status(401).send('Authentication required.');
        });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}
