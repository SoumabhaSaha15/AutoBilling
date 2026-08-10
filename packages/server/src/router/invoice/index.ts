import express from "express";
import ALL from "@/router/invoice/ALL";
import GET from "@/router/invoice/GET"
import POST from "@/router/invoice/POST";

const router = express.Router();
router
  .route('/invoice')
  .all(ALL.allowEmployee)
  .get(GET.getAllInvoices)
  .post(POST.invalidOrders);
export default router;
