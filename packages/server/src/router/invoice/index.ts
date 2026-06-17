import ALL from "./ALL.js";
import GET from "./GET.js"
import POST from "./POST.js";
import express from "express";
const router = express.Router();
router
  .route('/invoice')
  .all(ALL.allowEmployee)
  .get(GET.getAllInvoices)
  .post(POST.invalidOrders);
export default router;
