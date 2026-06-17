import express from "express";
import POST from "./POST.js";
import GET from "./GET.js";
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
    //@ts-ignore
    async (_req, _res, next) => {
      console.log("Admin login attempt:", _req.body);
      next();
    },
    POST.invalidCredentials,
    POST.userNotFound,
  );
export default router;
