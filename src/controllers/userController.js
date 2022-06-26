import User from "../models/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({username})//우리가 찾을 password를 찾을 DB 불러오기
    if(!user){
        return res.status(400).render("login",{pageTitle, errorMessage:"An account with this username doesn't exists."});
    }
    const ok = await bcrypt.compare(password, user.password);//출력값은 true/false임.
    if(!ok){
        return res.status(400).render("login",{pageTitle, errorMessage:"Wrong password"});
    }
    console.log("LOG USER IN! COMING SOON");
    return res.redirect("/");
}

export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("delete");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
