import User from "../models/User";

export const getJoin = (req, res) => res.render("join",{pageTitle:"Join"});
export const postJoin = async(req, res) => {
    //console.log(req.body);
    const { name, username, email, password, location } = req.body;
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
