import adminLogin from "./admin/index.js";
import express from "express";
const router = express.Router();
router
  .use(adminLogin);
export default router;
