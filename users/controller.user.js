const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../logger");
const util = require("../Utils/email")
const crypto = require("crypto");


//Logging in service function
const login = async ({ email, password }) => {
  try {
    logger.info("[Authenticate user] => login process started");

    const logInfo = { email, password };

    const user = await userModel.findOne({ email: logInfo.email });
    if (!user) {
      return {
        code: 404,
        message: "User not found",
      };
    }

    if (!user.verified) {
      return {
        code: 403,
        message: "You are not authorized to login yet.",
      };
    }

    const validPassword = await user.isValidPassword(logInfo.password)
    if (!validPassword) {
      return {
        code: 422,
        message: "email or password is incorrect",
      };
    }

    const token = await jwt.sign(
      { _id: user._id, email: user.email, profileImage:user.profileImage.secure_url, first_name:user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  
    logger.info("[Give user access] => login process successful");
    return {
      message: "successful login",
      code: 200,
      user,
      token,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      message: "An error occured. Try again later",
      code: 500,
      data: null,
    };
  }
};

//Password resetToken creation
const resetPassword = async (req, res)=>{
  try {
  const email = req.body.email
  const user = await userModel.findOne({email:email})
  if(!user){
    return res.redirect("/userNotFound")
  }

  const resetToken = user.createPasswordResetToken()
  
  const currUrl = "http://localhost:6500"
  const option = {
    email:user.email,
    subject:"We received your request for password reset",
    html:`<div style = "background-color:lightgrey; padding:16px"; border-radius:20px>
    <p>Hi, ${user.first_name}</P>
    <p>Click the link below to reset your paasword.</P>
    <p><a href= ${currUrl + "/users/resetPassword/newPassword/" + resetToken}>
    ${currUrl + "/resetPassword/reset/" + resetToken}
    </a>
    </P>
    <p>This link <b>will expire in the next 10min</b></P>
    </div>`
  }

  await util.sendEmail(option)
  
   return res.render("requestSuccessful", {
    message1:"Successful request.",
    message2:"Check your email for password reset link.",
    message3:"The link expires in 10mins"
   })
 
    
  } catch (err) {
    return res.redirect(`/serverError/${err.message}`)
  }

}

const verifyUserPasswordResetLink = async (req,res)=>{
  try{
  const resetToken = req.params.resetToken
  const hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  const user = await userModel.findOne({passwordResetToken: hashResetToken,
    passwordResetExpireDate:{$gt:Date.now()} })

    if(!user){
      let message = "It seems your link has expired.You need to resend the request.Go back to login page";
      return res.redirect(`/serverError/${message}`)
      
    }
    
    user.passwordResetToken = undefined
    user.passwordResetExpireDate = undefined
    user.save()

      return res.redirect(`/newPasswordPage/${user._id}`)
    }
    catch(err){
      res.redirect("/serverError")
    }
   
}

const setNewPassword = async (req, res)=>{
  try{
  const id = req.params.id
  const user = await userModel.findOne({_id:id})
  if(!user){
    return res.render("serverError", {
      navs:["Home", "Login"],
      err:"It seems you have tampered with the reset link.Check your email for password reset link or click the forgot password link again on the login page"
     })
  }
  const newPassword = req.body.newPassword
  user.saveNewPassword(newPassword)


 return res.render("requestSuccessful", {
    message1:"Successful password reset.", 
   message2:"You can now login with your new password.",
   message3:"Go back to the login page"
  })
  }catch(err){
    res.render("serverError", {
      navs:["Home", "Login"],
      err:err.message
     })
  }
}


module.exports = {login, resetPassword, verifyUserPasswordResetLink, setNewPassword };
