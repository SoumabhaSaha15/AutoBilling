import express from "express";
import GET from "./GET.js";
const router = express.Router();
router
  .route('/products-search')
  .get(
    async (req: express.Request, _: express.Response, next: express.NextFunction) => {
      try {
        if (req.session.clientType !== 'admin') throw new Error('You are not an admin');
        next();
      } catch (err) {
        next(err);
      }
    },
    GET.searchProduct
  );
export default router;
