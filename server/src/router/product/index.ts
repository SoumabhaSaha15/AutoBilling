import express from "express";
const router  = express.Router();
router
  .route('/add-product')
  .get()
  .post();
export default router;
