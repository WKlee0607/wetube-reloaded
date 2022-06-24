import express from "express";// 혹은 "node_modules/express"
import { urlencoded } from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express(); 
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd() + "/src/views");//process.cwd: 현재 작업중인 파일 위치.
app.use(logger);
app.use(express.urlencoded({extended:true}));//form의 내용을 js의 array object 형태로 바꿔줌-> req.body를 생성함!
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);


export default app;