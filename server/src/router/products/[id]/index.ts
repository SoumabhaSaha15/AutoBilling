import GET from './GET.js';
import express from "express";
import PATCH from './PATCH.js';
const router = express.Router();
router
  .route('/products/:id')
  .get(
    GET.notAnAdmin,
    GET.sendProduct
  )
  .patch(
    PATCH.uploadFile,
    PATCH.notAnAdmin,
    PATCH.updateProduct
  );
export default router;
