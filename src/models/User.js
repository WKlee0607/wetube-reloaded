import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{ type:String, required: true, unique:true },//unique: 딱 하나만 존재하게 해주려고.
    avatarUrl:String,
    socialOnly:{type:Boolean, default:false},
    username:{ type:String, required: true, unique:true },
    password:{ type:String},
    name:{ type:String, required:true },
    location: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
    comments :[{type:mongoose.Schema.Types.ObjectId, ref:"Comment" }],
    commentLikes : [{ type: mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    sub : {
        subscription : [{ type: mongoose.Schema.Types.ObjectId, ref:"User"}],// 내 채널 구독하는 사람들.
        subscribing : [{ type: mongoose.Schema.Types.ObjectId, ref:"User"}],// 구독 하는 채널.
    }  
})

userSchema.pre("save", async function() {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);//callback fn 공백 이유: await을 써주고 있기 때문.
    }
});

const User = mongoose.model("User",userSchema);
export default User;