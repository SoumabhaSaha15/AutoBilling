import express from "express";
import GET from "./GET.js";
const router = express.Router();
router
  .route('/products-search')
  .get(
    async (req, _, next) => {
      try {
        if (req.clientType !== 'admin') throw new Error('You are not an admin');
        next();
      } catch (err) {
        next(err);
      }
    },
    GET.searchProduct
  );
export default router;
