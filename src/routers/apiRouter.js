import express from "express";
import { registerView , createComment, removeComment , editComment, videoLike, likeComment } from "../controllers/videoController";
import { videoOwnerSubscription, getUserSubscription } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

//video
apiRouter.post("/videos/:id([0-9a-f]{24})/view", protectorMiddleware, registerView);// api/videos/:id/view
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", protectorMiddleware, createComment); // comment api router추가
apiRouter.post("/videos/:id([0-9a-f]{24})/like", protectorMiddleware, videoLike);
apiRouter.delete("/comment/:id([0-9a-f]{24})/remove", protectorMiddleware, removeComment);
apiRouter.post("/comment/:id([0-9a-f]{24})/edit", protectorMiddleware, editComment);
apiRouter.post("/comment/:id([0-9a-f]{24})/like", protectorMiddleware, likeComment);

//user
apiRouter.route("/users/:id([0-9a-f]{24})/subscription").all(protectorMiddleware).get(getUserSubscription).post(videoOwnerSubscription);

export default apiRouter;