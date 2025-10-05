import express  from "express";
import GET from './GET.js';
const router = express.Router();
router
  .route('/products/:id')
  .get(GET.notAnAdmin,GET.sendProduct);
export default router;
