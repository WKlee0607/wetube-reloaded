import express from "express";
import {getEdit, postEdit, logout, see, startGithubLogin, callbackGithubLogin, getChangePassword, postChangePassword} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload, s3DeleteAvatar } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), s3DeleteAvatar,postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleware, callbackGithubLogin);
userRouter.get("/:id([0-9a-f]{24})",see);


export default userRouter;