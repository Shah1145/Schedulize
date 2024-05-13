import express from "express";
import UserController from "../controllers/user.js";

const userRouter = express.Router();

// Register User
userRouter.post("/signup", UserController.SignUp);

// Login user
userRouter.post("/signin", UserController.SignIn);

//getUserdata
userRouter.post("/user", UserController.auth);

userRouter.get("/auth/google", UserController.loginWithGoogle);
userRouter.get("/auth/google/callback", UserController.loginWithGoogleCallback);

userRouter.get("/auth/googleCalender", UserController.googleAuth);
userRouter.get("/auth/googleCalender/callback", UserController.googleCallBack);
userRouter.post("/calendar/events", UserController.calenderEvents);

userRouter.get("/auth/googleMeet", UserController.googleMeetAuth);
userRouter.get("/auth/googleMeet/callback", UserController.googleMeetCallBack);

export default userRouter;
