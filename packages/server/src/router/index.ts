import morgan from "morgan";
import express from "express";
import logout from "@/router/logout/index"
import invoices from "@/router/invoice/index";
import products from "@/router/products/index";
import adminLogin from "@/router/admin_login/index";
import invoiceId from "@/router/invoice/[id]/index";
import productId from "@/router/products/[id]/index";
import employeeLogin from "@/router/employee_login/index";
import registerEmployee from "@/router/register_employee/index";
import allowWithoutAuth from "@/configurations/sessionAuthenticator";

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
