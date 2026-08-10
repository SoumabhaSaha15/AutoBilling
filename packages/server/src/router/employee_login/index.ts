import express from "express";
import GET from "@/router/employee_login/GET";
import POST from "@/router/employee_login/POST";

const router = express.Router();
router
  .route('/employee_login')
  .get(
    GET.cookiesNotFound,
    GET.invalidCookies,
    GET.adminNotFound,
    GET.provideAdminData
  )
  .post(
    POST.invalidCredentials,
    POST.userNotFound,
  );
export default router;
