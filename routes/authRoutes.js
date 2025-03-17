import express from "express";
import {registerController, loginController, testController, forgotPasswordController, resetPasswordController, getCryptoRatesController} from '../controller/authController.js'

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router()

router.post('/register', registerController)
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/crypto-rates", getCryptoRatesController);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});
export default router