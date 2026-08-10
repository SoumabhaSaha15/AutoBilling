
import express from "express";
import POST from "@/router/products/POST";
import GET from "@/router/products/GET.js";

const router = express.Router();
router
  .route('/products')
  .get(
    GET.notAnAdmin,
    GET.sendData
  )
  .post(
    POST.uploadFile,
    POST.notAnAdmin,
    POST.invalidDetails,
    POST.sendData
  );
export default router;
