import morgan from "morgan";
import express from "express";
import logout from "./logout/index.js"
import invoices from "./invoice/index.js";
import products from "./products/index.js";
import adminLogin from "./admin_login/index.js";
import invoiceId from "./invoice/[id]/index.js";
import productId from "./products/[id]/index.js";
import employeeLogin from "./employee_login/index.js";
import registerEmployee from "./register_employee/index.js";
import allowWithoutAuth from "./../configurations/sessionAuthenticator.js";
const router = express.Router();
router
  .use(allowWithoutAuth(['/admin_login', '/employee_login']))
  .use(morgan(':method :url :status :res[content-length] - :response-time ms'))
  .use(adminLogin)
  .use(employeeLogin)
  .use(products)
  .use(productId)
  .use(invoices)
  .use(invoiceId)
  .use(logout)
  .use(registerEmployee);
export default router;
