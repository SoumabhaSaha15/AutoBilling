import GET from "@/router/logout/GET";
import express from "express";
const router = express.Router();
router
  .route('/logout')
  .get(GET.destroySession);
export default router;
