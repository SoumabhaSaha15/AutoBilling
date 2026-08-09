import express from "express";
import GET from "@/router/admin_login/GET";
import POST from "@/router/admin_login/POST";


const router = express.Router();
router
  .route('/admin_login')
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
