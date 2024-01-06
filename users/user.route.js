const express = require("express");
const middleware = require("./middleware.user");
const controller = require("./controller.user");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const userVerificationModel = require("../models/userVerification");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("../integration/cloudinary");
const fs = require("fs");
const util = require("../Utils/email");

const userRouter = express.Router();

userRouter.use("/public", express.static("public"));

// ---------------------Creating a users-----------------------------------
userRouter.post(
  "/signup",
  upload.single("profileImage"),
  middleware.validateUser,
  async (req, res) => {
    const userInfo = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      verified: "false",
    };

    const existingUser = await userModel.findOne({ email: userInfo.email });
    if (existingUser) {
      return res.status(409).redirect("/existingUser");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile-images",
    });

    const newUser = await userModel.create({
      email: userInfo.email,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      password: userInfo.password,
      profileImage: result,
      verified: userInfo.verified,
    });

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    logger.info(
      `[CreateUser] => User with email ${newUser.email} created successfully`
    );

    sendVerificationEmail(newUser, res);
  }
);
// sendVerificationEmail function
const sendVerificationEmail = ({ _id, email, first_name, last_name }, res) => {
  const currUrl = "http://localhost:6500";

  const uniqueString = uuidv4() + _id;

  const option = {
    email: email,
    subject: "Verify your email",
    html: `<div style = "background-color:lightgrey; padding:16px"; border-radius:20px>
    <p>Hi, ${first_name}</P>
    <p>Thank you for opening account with us.</p>
    <p>We need to confirm it is you before being authorized to login to your account</P>
        <p>Click <a href=${
          currUrl + "/users/verify/" + _id + "/" + uniqueString
        }>here</a> to get authorized</P>
        <p>This link <b>will expire in the next 6hrs</b></p>
        <p>We look forward to highly educative and insightful blogs from you.</P>
        <p>Click this link: <a href=${
          currUrl + "/users/verify/" + _id + "/" + uniqueString
        } >${currUrl + "/users/verify/" + _id + "/" + uniqueString}<a/></p>
        </div>`,
  };

  userVerificationModel
    .create({
      userId: _id,
      uniqueString: uniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    })
    .then(() => {
      util
        .sendEmail(option)
        .then(() => {
          return res.render("successfulSignup", {
            name: `${first_name + " " + last_name}`,
            message1: "We have sent you an email.",
            message2: "Check for email verification link.",
            message3: "The link expires in the next 6hrs",
          });
        })
        .catch((err) => {
          let message =
            "An error occured while sending you a mail. Try to signup again";
          return res.redirect(`/serverError/${message}`);
        });
    })
    .catch((err) => {
      let message =
        "An error occured while saving your details. Try signup again";
      return res.redirect(`/serverError/${message}`);
    });
};

// Making a get request to login page through the link sent to user's email
userRouter.get("/verify/:userId/:uniqueString", (req, res) => {
  const { userId, uniqueString } = req.params;
  userVerificationModel
    .find({ userId })
    .then((user) => {
      if (!user[0]) {
        return res.redirect("/userNotFound");
      }
      if (user[0].expiresAt < Date.now()) {
        userVerificationModel
          .deleteOne({ userId })
          .then(() => {
            userModel
              .deleteOne({ _id: userId })
              .then(() => {
                let message =
                  "It seems your link has expired.You will need to signup again";
                return res.redirect(`/serverError/${message}`);
              })
              .catch((err) => {
                let message =
                  "An error occured. Go back to your email and try again";
                return res.redirect(`/serverError/${message}`);
              });
          })
          .catch((err) => {
            let message =
              "An error occured. Go back to your email and try again";
            return res.redirect(`/serverError/${message}`);
          });
      } else {
        bcrypt
          .compare(uniqueString, user[0].uniqueString)
          .then((valid) => {
            if (!valid) {
              let message =
                "It seems your verification link is altered. Go back to your email and try again";
              return res.redirect(`/serverError/${message}`);
            } else {
              userModel
                .findByIdAndUpdate({ _id: userId }, { verified: "true" })
                .then(() => {
                  userVerificationModel
                    .deleteOne({ userId })
                    .then(() => {
                      return res.redirect("/loginAuthorized");
                    })
                    .catch((err) => {
                      let message =
                        "An error occured. Go back to your email and try again";
                      return res.redirect(`/serverError/${message}`);
                    });
                })
                .catch((err) => {
                  let message =
                    "An error occured. Go back to your email and try again";
                  return res.redirect(`/serverError/${message}`);
                });
            }
          })

          .catch((err) => {
            return res.redirect(`/serverError/${err.message}`);
          });
      }
    })
    .catch((err) => {
      return res.redirect(`/serverError/${err.message}`);
    });
});

userRouter.get(
  "/resetPassword/newPassword/:resetToken",
  controller.verifyUserPasswordResetLink
);

//Logging in users
userRouter.use(cookieParser());

userRouter.post("/login", middleware.validateLogInfo, async (req, res) => {
  const response = await controller.login({
    email: req.body.email,
    password: req.body.password,
  });
  if (response.code === 200) {
    res.cookie("jwt", response.token, { maxAge: 60 * 60 * 1000 });
    res.redirect("/dashboard");
  } else if (response.code === 404) {
    res.redirect("/userNotFound");
  } else if (response.code === 403) {
    res.redirect(`/loginUnAuthorized/${response.message}`);
  } else if (response.code === 422) {
    res.redirect("/invalidInfo");
  } else {
    return res.redirect(`/serverError/${response.message}`);
  }
});

userRouter.post("/resetPassword", controller.resetPassword);

userRouter.post("/newPassword/:id", controller.setNewPassword);

module.exports = userRouter;


