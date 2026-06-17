import GET from "./GET.js";
import ALL from "./ALL.js"
import express from "express";
const router = express.Router();
router
  .route('/invoice/:id')
  .all(ALL.allowEmployee)
  .get(GET.getInvoiceById);
export default router;
