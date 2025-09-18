import express from "express";
import POST from "./POST.js";
const router = express.Router();
router
  .route('/register_employee')
  .post(
    POST.uploadFile,
    POST.notAnAdmin,
    POST.invalidDetails,
    POST.sendData
  );
export default router;
