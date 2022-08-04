import express from "express";
import { registerView , createComment, removeComment , editComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);// api/videos/:id/view
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment); // comment api router추가
apiRouter.delete("/comment/:id([0-9a-f]{24})/remove", removeComment);
apiRouter.post("/comment/:id([0-9a-f]{24})/edit", editComment);

export default apiRouter;