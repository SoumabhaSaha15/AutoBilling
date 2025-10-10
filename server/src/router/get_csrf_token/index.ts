import express from "express";
import GET from "./GET.js";
const router = express.Router();
router
  .route('/get_csrf_token')
  .get(GET.getCsrfToken);
export default router;
