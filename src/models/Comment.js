import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {type:String, required:true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"User" }, // User와 mongoose relationship
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Video" }, // Video와 mongoose relationship
    meta : {
        likes: [{type: mongoose.Schema.Types.ObjectId, required: true, ref:"User"}],
    },
    createdAt: {type:Date, required:true, default:Date.now },
});

const Comment = mongoose.model("Comment", commentSchema); //"Comment"는 다른 Schema 등에서 ref로 사용되는 곳과 일치하도록 써줘야함.

export default Comment;