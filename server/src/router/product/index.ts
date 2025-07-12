import POST from "./POST.js";
import GET from "./GET.js";
import express from "express";
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
