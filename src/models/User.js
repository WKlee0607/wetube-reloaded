import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{ type:String, required: true, unique:true },//unique: 딱 하나만 존재하게 해주려고.
    username:{ type:String, required: true, unique:true },
    password:{ type:String, required: true },
    name:{ type:String, required:true },
    location: String,
})

userSchema.pre("save", async function() {
    //console.log("befor hash: ",this.password) -> hash되기 전
    this.password = await bcrypt.hash(this.password, 5);//callback fn 공백 이유: await을 써주고 있기 때문.
    //console.log("after hash: ",this.password) -> hash된 후
});

const User = mongoose.model("User",userSchema);
export default User;