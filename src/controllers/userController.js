import User from "../models/User";
import Video from "../models/Video"
import fetch from "cross-fetch";
import bcrypt from "bcrypt";
import session from "express-session";

import aws from "aws-sdk";
import {s3} from "../middlewares"

export const getJoin = (req, res) => res.render("join",{pageTitle:"Join"});
export const postJoin = async(req, res) => {
    //console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {pageTitle, errorMessage:"Password confirmation does not match"});
    }
    const exists = await User.exists({$or: [{username}, {email}]});//username or email 둘 중 하나라도 DB에 존재하는 User와 일치한다면 true를 반환할 것임.
    if(exists){
        return res.status(400).render("join", {pageTitle, errorMessage:"This username/email is already taken"});
    }
    try{
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        })//User 생성
        return res.redirect("/login");//회원가입하고 login창으로 보내주기
    } catch(error){
        console.log(error);
        return res.status(400).render("join",{
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req,res) => res.render("login",{pageTitle:"Login"});

export const postLogin = async(req,res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username, socialOnly:false})//우리가 찾을 password를 찾을 DB 불러오기
    if(!user){
        return res.status(400).render("login",{pageTitle, errorMessage:"An account with this username doesn't exists."});
    }
    const ok = await bcrypt.compare(password, user.password);//출력값은 true/false임.
    if(!ok){
        return res.status(400).render("login",{pageTitle, errorMessage:"Wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;//우변의 user = await User.findOne({username}) -> 세션에 정보 담기.
    return res.redirect("/");
}

export const startGithubLogin =(req,res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const callbackGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code, // callback에서 준 코드를 받는 방법. query: parameter를 부르는 것.
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;//token을 가져오기 위한 url
    const tokenRequest = await (
    await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json",
        }
    })
    ).json();

    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";//token을 이용해 Github API에 접근하는 url
        const userData = await ( await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`, // Authorization: 보호된 리소스에 대한 접근을 허용하여 서버로 User agent를 인증하는 자격증명을 보내는 역할을 합니다
            }
        })).json();
        //console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json(); // github에 관해 여러 이메일들을 가져옴.
        const emailObj = emailData.find(//find: object들 중, 원하는 object찾을 때 이용.
            (email) => email.primary === true && email.verified === true
          );
        if(!emailObj){
            // set notification
            return res.status(404).redirect("/login");//나중에 notification도 보내줄 것임. -> notification: user가 /login으로 redirect하게 해주고, user가 /login에서 에러 메시지를 보게 햐줄것임.
        }
        let user = await User.findOne({ email: emailObj.email });// github에서 찾은 이메일을 우리의 DB에서 찾는것임.
        if(!user){
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name? userData.name:userData.login,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,//socialOnly:true ->  소셜 계정으로 만들어진 계정이란 뜻임. 따라서 이 사람은 password가 없으므로 login form을 이용할 수 없음.
                location: userData.location? userData.location:"Unknown",
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");

    } else{
        return res.redirect("/login");//나중에 notification도 보내줄 것임. -> notification: user가 /login으로 redirect하게 해주고, user가 /login에서 에러 메시지를 보게 햐줄것임.
    }
};

//kakao login

export const startKakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const host = req.host
    let redirect_uri = ""
    if(host === "localhost"){
        redirect_uri = "http://localhost:4000/users/kakao/callback";
    }
    else {
        redirect_uri = "https://itube-by-wk.herokuapp.com/users/kakao/callback";
    }
    const config = {
        response_type:"code",
        client_id:process.env.KAKAO_CLIENT,
        redirect_uri:redirect_uri,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const callbackKakaoLogin = async (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const host = req.host
    let redirect_uri = ""
    if(host === "localhost"){
        redirect_uri = "http://localhost:4000/users/kakao/callback";
    }
    else {
        redirect_uri = "https://itube-by-wk.herokuapp.com/users/kakao/callback";
    }
    const config = {
        grant_type:"authorization_code",
        client_id:process.env.KAKAO_CLIENT,
        client_secret: process.env.KAKAO_SECRET,
        redirect_url:redirect_uri,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        })
        ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://kapi.kakao.com/v2/user/me";
        const userDataAll = await (await fetch(`${apiUrl}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            secure_resource: true,
        })).json();
        const userData = userDataAll.kakao_account;
        let userEmail = userData.email;
        if(!userEmail){
            await fetch("https://kapi.kakao.com/v1/user/unlink", {
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            req.flash("error", "Please agree to collect your email");
            return res.status(404).redirect("/login");
        }
        let user = await User.findOne({ email: userData.email });// github에서 찾은 이메일을 우리의 DB에서 찾는것임.
        if(!user){
            user = await User.create({
                avatarUrl: "",
                name: userData.profile.nickname ? userData.profile.nickname : "Unknown",
                username: userData.profile.nickname ? userData.profile.nickname : "Unknown",
                email: userEmail ? userEmail : "Unknown",
                password: "",
                socialOnly: true,//socialOnly:true ->  소셜 계정으로 만들어진 계정이란 뜻임. 따라서 이 사람은 password가 없으므로 login form을 이용할 수 없음.
                location: "Unknown",
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};


//

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle:"Edit Profile"});
};

export const postEdit = async (req, res) => {
    const { session: {user: {_id, avatarUrl}}, body: { name, email, username, location}, file} = req;//여기서 body는 업데이트 된 정보.
    //onsole.log(file); 없으면 undefined로 뜰 것임
    if(req.session.user.email !== email || req.session.user.username !== username){
        const existEmail = await User.exists({email});
        const existUsername = await User.exists({username});
        if(existEmail || existUsername){
            return res.render("edit-profile",{pageTitle:"Edit Profile",errorSpan:"that email/username is already used"});
        } 
    } 
    const isHeroku = process.env.NODE_ENV === "production";
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? (isHeroku ? file.location : file.path) :avatarUrl,
        name,
        email,
        username,
        location,
    },
    {new:true}
    );
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        req.flash("error", "Can't change password.");
        return res.redirect("/");
    }
    return res.render("users/change-password",{pageTitle:"Change Password"});
};

export const postChangePassword = async (req, res) => {
    const { session: {user: {_id}}, body: { oldPassword, newPassword, newPasswordConfirmation }} = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password)//bcrypt: 비밀번호 암호화 해주는 패키지 , compare: 두 인수를 받아 첫번째는 암호화하여 비교하고, 두번째는 그 상태 그대로(암호화가 이미 걸린상태) 두고 두 인수를 비교한다. 출력값은 Boolean
    if(!ok){
        return res.status(400).render("users/change-password",{pageTitle:"Change Password", errorMessage: "The current password is incorrect"});
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password",{pageTitle:"Change Password", errorMessage: "The password does not match the confirmation"});
    }
    
    user.password = newPassword;//user.password를 새로운 비밀번호로 바꿔주는 것임.
    await user.save(); // model내장 함수 save()를 발동시킴. save: password를 hash화 시켜서 저장함. // save는 promise일지도 모르기에 await을 해줌
    // send notification
    return res.redirect("/users/logout");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate : {
            path:"owner",
            model: "User",
        }
    });
    if(!user){
        return res.status(404).render("404",{pageTitle:"User not found."});
    }
    return res.render("users/profile", {pageTitle: user.name, user})
}
