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
    comments :[{type:mongoose.Schema.Types.ObjectId, ref:"Comment" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
})

userSchema.pre("save", async function() {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);//callback fn 공백 이유: await을 써주고 있기 때문.
    }
});

const User = mongoose.model("User",userSchema);
export default User;