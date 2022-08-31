import express from "express";
import {getEdit, postEdit, logout, see, startGithubLogin, callbackGithubLogin, getChangePassword, postChangePassword , startKakaoLogin, callbackKakaoLogin, seeMySubscription,  getUserLikeVideos} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload, s3DeleteAvatar, } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), s3DeleteAvatar,postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleware, callbackGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/callback", publicOnlyMiddleware, callbackKakaoLogin);
userRouter.get("/:id([0-9a-f]{24})",see);

//menu창에서 클릭시
userRouter.get("/subscription", protectorMiddleware , seeMySubscription); // req.params를 이용하지 않고, session을 이용해 user의 likedVideos를 구해 넘겨주는 방식 도전.
userRouter.get("/like-videos", protectorMiddleware, getUserLikeVideos); // req.params를 이용하지 않고, session을 이용해 user의 likedVideos를 구해 넘겨주는 방식 도전.


export default userRouter;