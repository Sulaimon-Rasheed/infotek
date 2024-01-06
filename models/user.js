const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: { type: String, unique:true }, 
  first_name: { type: String},
  last_name: { type: String},
  password: { type: String, unique: true},
  profileImage:{type:Object, required:true},
  verified:{type:Boolean},
  passwordResetToken:{type:String},
  passwordResetExpireDate:{type:Date},
});

UserSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
      next();
  });
  
  UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  };

  UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpireDate = Date.now() + 10 * 60 * 1000
    this.save()
    return resetToken
  }

  UserSchema.methods.saveNewPassword = async function(newPassword){
   this.password = newPassword
   this.save()
  }

module.exports = mongoose.model("users", UserSchema);