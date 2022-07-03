import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    //console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);//local안에 session의 loggedIn을 넣어줌
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Wetube";
    //console.log(res.locals)
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else{
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else{
        return res.redirect("/");
    }
}

export const avatarUpload = multer({ dest: "uploads/avatars/", limits:{//limits: Limits of the uploaded data
    fileSize: 3000000,//(단위: byte)
}, });

export const videoUpload = multer({ dest: "uploads/videos/", limits:{
    fileSize: 10000000,
}, });