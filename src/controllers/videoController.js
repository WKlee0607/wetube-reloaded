import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User"
import { async } from "regenerator-runtime";
import { response } from "express";

export const home = async(req,res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");//await: 해당 코드가 끝날 때까지 다음 순서의 코드를 진행시키지 않음. 즉, 해당 코드를 기다려주는 역할을 함./ video.find: 모든 DB에 있는 모든 video를 찾음
    console.log(videos);
    return res.render("home",{pageTitle : "Home",videos});//videos를 db에서 받아옴.
};

export const watch = async(req,res) => {
    const {params:{id}} = req;
    const video = await Video.findById(id).populate("owner").populate("comments").populate({path: "comments", populate : {path: "owner"}})//Video에서 찾아도 되는 이유: 이 파일에 mongoose가 import돼 있으며, 이는  mongoDB와 이어져 있고 이를 이용해 Video model을 만들었으므로 자연스레 찾을 수 있게됨.
    if(!video){
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch",{pageTitle : video.title, video });
};


export const getEdit = async(req,res) => {
    const {id} = req.params;
    const {user:{_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit",{pageTitle:`Editing ${video.title}`, video});
};

export const postEdit = async (req, res) => {//post를 하면 mongoDB 내의 값을 변경해줌.
    const {user:{_id}} = req.session;
    const {id} = req.params;
    const {title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});//video: DB에서 검색한 영상 object , Video: 우리가 만든 비디오 모델임.
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title:title,
        description:description,
        hashtags:Video.formatHashtag(hashtags),
    });
    req.flash("success", "Changes saved.");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req,res) => {
    return res.render("upload",{pageTitle:"Upload Video"});
};

export const postUpload = async(req,res) => {
    const {user : {_id}} = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    try{
        const newVideo = await Video.create({//Video.create: video를 생성하고, DB에 저장함.
            title,
            description,
            fileUrl: isHeroku ? video[0].location: video[0].path,
            thumbUrl: isHeroku ? thumb[0].location: thumb[0].path,
            owner:_id,
            hashtags:Video.formatHashtag(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    }
    catch(error){
        console.log(error);
        return res.status(400).render("upload",{
            pageTitle:"Upload Video",
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
    const {user:{_id}} = req.session;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    user.videos.splice(user.videos.indexOf(_id),1);
    user.save();
    return res.redirect("/");
};

export const search = async (req, res) => {
    //console.log(req.query);
    //console.log(keyword); -> 값 O: 값, 값 X: undefined
    const { keyword } = req.query;//-> req.query의 keyword의 value를 반환해줌.
    let videos =[];//array로 만든 이유: search.pug에서 each를 이용하는데 이 each는 array만 받기 떄문임.
    if(keyword){
        videos = await Video.find({
            title :{
                $regex: new RegExp(keyword, "i")//RegExp(단어, 속성):keyword를 포함하는 비디오를 검색해줌 ,i: keyword대소문자 구분없이 검색하도록 해줌
            }
        }).populate("owner")
    }
    return res.render("search",{pageTitle:"Search", videos});
};

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200); // 200: done, ok라는 뜻임. -> sendStatus를 보내야 연결을 성공적으로 끝낼 수 있음.
};
    
export const createComment = async (req, res) => {
    const {session : {user}, body : {text}, params : {id}} = req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video:id,
    });
    video.comments.push(comment._id); // 만들 댓글의 ObjId를  비디오의 comments array에 넣어줌
    video.save(); //comments array에 변경사항 생겨서 저장해줌 !
    return res.status(201).json({ newCommentId: comment._id, user}); // fetch에 대해 프론트엔드로 데이터를 보내고 싶다면 json 형태로 보내야함.
};

// 내가 만든 controller
export const removeComment = async (req, res) => {
    const { params :{id}, session:{user : {_id}}} = req;
    const comment = await Comment.findById(id);
    const videoid = String(comment.video);
    const video = await Video.findById(videoid);
    if(!comment){
        req.flash("error", "Comment Not Found.");
        return res.sendStatus(404);
    }
    if(!video){
        req.flash("error", "Video Not Found.");
        return res.sendStatus(404);
    }
    if(String(comment.owner) !== String(_id)){
        req.flash("error", "You are not this comment's owner");
        return res.sendStatus(404);
    }
    await Comment.findByIdAndDelete(id);
    const newarr = video.comments.filter((comment) => String(comment) !== String(id));
    video.comments = newarr
    video.save();
    return res.sendStatus(200);
};

export const editComment = async (req, res) => {
    const {body, params:{id}, session:{user : {_id}}} = req;
    const comment = await Comment.findById(id);
    if(!comment){
        req.flash("error", "Comment Not Found.");
        return res.sendStatus(404);
    }
    if(String(comment.owner) !== String(_id)){
        req.flash("error", "You are not this comment's owner");
        return res.sendStatus(404);
    }
    comment.text = body.text;
    comment.save();
    return res.sendStatus(200);
};

// video like 
export const videoLike = async (req, res) => {
    const {params:{id}, session:{user:{_id}}} = req;
    const user = await User.findById(_id);
    const video = await Video.findById(id);
    const found = video.meta.likes.find((element) => element !== _id);
    if(!user || !video){
        req.flash("error", "video or user is not exists");
        return res.sendStatus(404);
    }
    if(found){
        user.likes.splice(user.likes.indexOf(id),1);
        video.meta.likes.splice(video.meta.likes.indexOf(_id),1);
        user.save();
        video.save();
        return res.sendStatus(204);
    }
    user.likes.push(id);
    user.save();
    video.meta.likes.push(_id);
    video.save();
    return res.status(200).json({likes : video.meta.likes});
};

export const likeComment = async (req, res) => {
    const {session : {user : {_id}}, params : {id}} = req;
    const user = await User.findById(_id);
    const comment = await Comment.findById(id);
    if(!user || !comment){
        req.flash("error", "comment or user is not exists");
        return res.sendStatus(404);
    }
    const found = comment.meta.likes.find((element) => element !== _id);
    if(found){
        user.commentLikes.splice(user.commentLikes.indexOf(id),1);
        comment.meta.likes.splice(comment.meta.likes.indexOf(_id),1);
        user.save();
        comment.save();
        return res.sendStatus(204);
    }
    comment.meta.likes.push(_id);
    user.commentLikes.push(id);
    comment.save();
    user.save();
    return res.status(200).json({commentLikes : comment.meta.likes});
}