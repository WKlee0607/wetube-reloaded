import express from "express";
import { registerView , createComment, removeComment, getComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);// api/videos/:id/view
apiRouter.route("/videos/:id([0-9a-f]{24})/comment").post(createComment).get(getComment); // comment api router추가
apiRouter.post("/videos/:id([0-9a-f]{24})/commentRemove", removeComment);

export default apiRouter;