import Video from "../models/Video";

export const home = async(req,res) => {
        const videos = await Video.find({});//await: 해당 코드가 끝날 때까지 다음 순서의 코드를 진행시키지 않음. 즉, 해당 코드를 기다려주는 역할을 함.
        console.log(videos);
        return res.render("home",{pageTitle : "Home",videos});//videos를 db에서 받아옴.
};

export const watch = (req,res) => {
    const id = req.params.id;
    return res.render("watch",{pageTitle : `Watching`});
}
export const getEdit = (req,res) => {
    const id = req.params.id;
    return res.render("edit",{pageTitle:`Editing`});
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req,res) => {
    return res.render("upload",{pageTitle:"Upload Video"});
}

export const postUpload = async(req,res) => {
    // here we will add a video to the videos array.
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({
            title:title,
            description:description,
            hashtags: hashtags.split(",").map((word) => `#${word}`),
        });
        return res.redirect("/");
    }
    catch(error){
        return res.render("upload",{
            pageTitle:"Upload Video",
            errorMessage: error._message,
        });
    }
}

