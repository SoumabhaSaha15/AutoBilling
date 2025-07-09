import express from "express";
import POST from "./POST.js";
import GET from "./GET.js";
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
    POST.wrongCredentials,
    POST.setCookie,
  );
export default router;
