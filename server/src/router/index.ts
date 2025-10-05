import express from "express";
import adminLogin from "./admin/index.js";
import product from "./product/index.js";
import employeeLogin from "./employee/index.js";
import invoiceRouter from "./invoice/index.js";
// import search from "./product/search/index.js";
import registerEmployee from "./registerEmployee/index.js";
const router = express.Router();
const logoutRouter = express.Router(), csrfRouter = express.Router();
logoutRouter
  .route('/logout')
  .get(async (req: express.Request, res: express.Response) => {
    if (!req.session.clientId) res.status(401).send('No cookie found.');
    else {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).send("Could not log out successfully due to a server error.");
        }
        res.clearCookie('id');
        res.clearCookie('connect.sid');
        res.status(200).send('Logged out successfilly.');
      });
      return;
    }
  });
csrfRouter.route('/get-csrf-token').get(async (req: express.Request, res: express.Response) => void res.status(200).send(req.csrfToken()));
router
  .use(adminLogin)
  .use(employeeLogin)
  .use(product)
  .use(invoiceRouter)
  .use(logoutRouter)
  .use(registerEmployee)
  .use(csrfRouter);
export default router;
