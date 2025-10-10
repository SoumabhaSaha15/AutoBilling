import GET from "./GET.js";
import express from "express";
const router = express.Router();
router
  .route('/logout')
  .get(GET.destroySession);
export default router;
