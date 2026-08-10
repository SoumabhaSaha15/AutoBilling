import express from "express";
import GET from '@/router/products/[id]/GET';
import PATCH from '@/router/products/[id]/PATCH';

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
