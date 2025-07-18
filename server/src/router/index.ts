import express from "express";
import adminLogin from "./admin/index.js";
import product from './product/index.js'
import employeeLogin from "./employee/index.js";
import invoiceRouter from "./invoice/index.js"
const router = express.Router();
const logoutRouter = express.Router();
logoutRouter
  .route('/logout')
  .get(async (req: express.Request, res: express.Response) => {
    if (!req.cookies['id']) res.status(401).send('No cookie found.')
    else {
      res.clearCookie('id');
      res.status(200).send('Logged out successfilly.');
    }
  });

router
  .use(adminLogin)
  .use(employeeLogin)
  .use(product)
  .use(invoiceRouter)
  .use(logoutRouter);
export default router;
