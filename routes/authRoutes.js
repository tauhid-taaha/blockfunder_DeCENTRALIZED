import express from "express";
import {registerController, loginController, testController, forgotPasswordController, resetPasswordController, getCryptoRatesController, getCryptoNewsController} from '../controller/authController.js'
import userModel from "../models/userModel.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router()

router.post('/register', registerController)
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/crypto-rates", getCryptoRatesController);
router.get("/crypto-news", getCryptoNewsController);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// The client is calling /auth/users/me but our route is at /users/me
// Move this route to match the client's expectation
router.get("/me", requireSignIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching user data",
            error,
        });
    }
});

export default router