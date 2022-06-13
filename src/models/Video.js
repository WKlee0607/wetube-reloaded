import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type:String, required:true, trim:true, maxlength:80},//{type:String}이라 써도됨.
    description: {type:String, required:true, trim:true, minlength:10},
    createdAt: {type:Date, required:true, default:Date.now },
    hashtags:[{type:String, trim:true}],
    meta: {
        views:{type:Number, default:0, required:true},
        rating:{type:Number, default:0, required:true},
    },
})

const Video = mongoose.model("Video",videoSchema);//model(modelName, Schema)
export default Video;