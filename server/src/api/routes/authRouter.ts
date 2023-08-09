import { loginController, signupController } from "@controllers/authController";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);

export default authRouter;
