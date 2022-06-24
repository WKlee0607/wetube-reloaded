import User from "../models/User";

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
    await User.create({
        name, 
        username, 
        email, 
        password, 
        location,
    })//User 생성
    return res.redirect("/login");//회원가입하고 login창으로 보내주기
};
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("delete");
export const login = (req,res) => res.send("Log in");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
