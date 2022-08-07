import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {//mongoDB의 url서버에 연결해준 것임.
   
});

const db = mongoose.connection;//mongoose가 mongoDB에 대한 connection 접근을 줌.
//그래서 우리는 서버와 database서버의 사이의 현재 connection에 액세스 할 수 있음.
const handleOpne = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);
db.on("error",handleError);
db.once("open",handleOpne);