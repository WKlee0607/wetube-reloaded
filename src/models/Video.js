import mongoose, { mongo, Mongoose } from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type:String, required:true, trim:true, maxlength:80},//{type:String}이라 써도됨.
    fileUrl: {type:String, required: true},
    description: {type:String, required:true, trim:true, minlength:10},
    createdAt: {type:Date, required:true, default:Date.now },
    hashtags:[{type:String, trim:true}],
    meta: {
        views:{type:Number, default:0, required:true},
    },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"User" }
})

videoSchema.static('formatHashtag', function(hashtags){
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`))
});


const Video = mongoose.model("Video",videoSchema);//model(modelName, Schema)
export default Video;