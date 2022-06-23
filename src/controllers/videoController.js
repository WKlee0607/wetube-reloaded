import Video from "../models/Video";

export const home = async(req,res) => {
        const videos = await Video.find({}).sort({createdAt:"desc"});//await: 해당 코드가 끝날 때까지 다음 순서의 코드를 진행시키지 않음. 즉, 해당 코드를 기다려주는 역할을 함./ video.find: 모든 DB에 있는 모든 video를 찾음
        console.log(videos);
        return res.render("home",{pageTitle : "Home",videos});//videos를 db에서 받아옴.
};

export const watch = async(req,res) => {
    const id = req.params.id;
    const video = await Video.findById(id);//Video에서 찾아도 되는 이유: 이 파일에 mongoose가 import돼 있으며, 이는  mongoDB와 이어져 있고 이를 이용해 Video model을 만들었으므로 자연스레 찾을 수 있게됨.
    if(!video){
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch",{pageTitle : video.title, video});
}
export const getEdit = async(req,res) => {
    const id = req.params.id;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("edit",{pageTitle:`Editing ${video.title}`, video});
}
export const postEdit = async (req, res) => {//post를 하면 mongoDB 내의 값을 변경해줌.
    const {id} = req.params;
    const {title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});//video: DB에서 검색한 영상 object , Video: 우리가 만든 비디오 모델임.
    if(!video){
        return res.render("404", { pageTitle: "Video not found." });
    }
    await Video.findByIdAndUpdate(id, {
        title:title,
        description:description,
        hashtags:Video.formatHashtag(hashtags),
    })
    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req,res) => {
    return res.render("upload",{pageTitle:"Upload Video"});
}

export const postUpload = async(req,res) => {
    // here we will add a video to the videos array.
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({//Video.create: video를 생성하고, DB에 저장함.
            title:title,
            description:description,
            hashtags:Video.formatHashtag(hashtags),
        });
        return res.redirect("/");
    }
    catch(error){
        console.log(error);
        return res.render("upload",{
            pageTitle:"Upload Video",
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

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
        })
    }
    return res.render("search",{pageTitle:"Search", videos});
}