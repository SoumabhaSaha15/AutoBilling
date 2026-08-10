import express from "express";
import ALL from "@/router/invoice/[id]/ALL"
import GET from "@/router/invoice/[id]/GET";

const router = express.Router();
router
  .route('/invoice/:id')
  .all(ALL.allowEmployee)
  .get(GET.getInvoiceById);
export default router;
