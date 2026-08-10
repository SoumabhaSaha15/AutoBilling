import express from "express";
import POST from "@/router/register_employee/POST";
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
