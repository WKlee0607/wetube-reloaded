import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { async } from "regenerator-runtime";
import Video from "./models/Video";

export const s3 = new aws.S3({//aws.S3에 access Key, secret Key를 전달해주는 것임.
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }//여기에 쓰인 key name이 heroku와 동일해야함.
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: "wkitube/images",//bucket이름 적기/폴더명
    acl:"public-read",
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: "wkitube/videos",//bucket이름 적기/폴더명
    acl:"public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE, //ios 동영사 재생 ㄱㄴ
});

export const localsMiddleware = (req, res, next) => {
    //console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);//local안에 session의 loggedIn을 넣어줌
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Wetube";
    res.locals.isHeroku = isHeroku;
    //console.log(res.locals)
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else{
        req.flash("error", "Log in first");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else{
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
};

export const avatarUpload = multer({ 
    dest: "uploads/avatars/",
    limits:{//limits: Limits of the uploaded data
        fileSize: 3000000,//(단위: byte)
    },
    storage: isHeroku ? s3ImageUploader : undefined, //heroku에 따라 storage의 정의 여부가 바뀜. 만약 undefined가 되면 파일은 dest로 갈 것임.
});

export const videoUpload = multer({ 
    dest: "uploads/videos/", 
    limits:{
        fileSize: 10000000,
    },
    storage: isHeroku ? s3VideoUploader : undefined, //heroku에 따라 storage의 정의 여부가 바뀜. 만약 undefined가 되면 파일은 dest로 갈 것임.
});

export const s3DeleteAvatar = (req, res, next) => {
    const {session: {user: {avatarUrl}}, file} = req;
    const isHeroku = process.env.NODE_ENV === "production";
    const avatar = file ? (isHeroku ? file.location : file.path) :avatarUrl;
    if(avatarUrl === avatar){
        return next();
    }
    s3.deleteObject({
        Bucket:"wkitube",
        Key: `images/${avatarUrl.split("/")[4]}`
    },(err, data) => {
        if(err){
            throw err;
        }
        console.log("s3 deleteObject", data);
    })
    next();
};

export const s3DeleteVideo = async (req, res, next) => {
    const {session: {user: {_id}}, params:{id}} = req;
    const video = await Video.findById(id);
    if(String(video.owner) !== String(_id)){
        return next();
    }
    s3.deleteObject({
        Bucket:"wkitube",
        Key: `videos/${id}`
    },(err, data) => {
        if(err){
            throw err;
        }
        console.log("s3 deleteObject", data);
    })
    next();
}