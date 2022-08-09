import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({//aws.S3에 access Key, secret Key를 전달해주는 것임.
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }//여기에 쓰인 key name이 heroku와 동일해야함.
});

const multerUploader = multerS3({
    s3: s3,
    bucket: "wkitube",//bucket이름 적기
    acl:"public-read",
});

export const localsMiddleware = (req, res, next) => {
    //console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);//local안에 session의 loggedIn을 넣어줌
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Wetube";
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
    storage: multerUploader, 
});

export const videoUpload = multer({ 
    dest: "uploads/videos/", 
    limits:{
        fileSize: 10000000,
    },
    storage: multerUploader,
});