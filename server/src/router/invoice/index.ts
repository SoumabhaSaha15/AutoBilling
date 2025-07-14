import express from "express";
const router = express.Router();
router
  .route('/invoice')
  .get().post();
export default router;
