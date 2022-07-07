import express from "express";// 혹은 "node_modules/express"
import { urlencoded } from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express(); 
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd() + "/src/views");//process.cwd: 현재 작업중인 파일 위치.
app.use(logger);
app.use(express.urlencoded({extended:true}));//form의 내용을 js의 array object 형태로 바꿔줌-> req.body를 생성함!


app.use(
    session({
        secret:process.env.COOKIE_SECRET,
        resave: false,
        saveUninitalized: false,
        /*cookie: {
            maxAge:20000,//단위: ms(밀리세컨드), 20초임, 세션의 만료날짜 정해주는 것임.
        },*/
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
}));

app.get("/add-one",(req,res,next)=>{
    return res.send(`${req.session.id}`);
});

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));// /assets는 assets 폴더 내용을 보여주는 거임
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);


export default app;