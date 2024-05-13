// import express from "express";
import User, { create } from "../models/user.js";
import { hash, compare } from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { google } from "googleapis";

dotenv.config();

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectCalenderurl = process.env.GOOGLE_REDIRECT_Calender_URI;
const redirectMeeturl = process.env.GOOGLE_REDIRECT_Meet_URI;

const googleStrategy = new GoogleStrategy(
	{
		clientID: clientid,
		clientSecret: clientsecret,
		callbackURL: "http://localhost:8000/users/auth/google/callback",
		scope: ["profile", "email"],
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const firstName = profile.name.givenName;
			const lastName = profile.name.familyName;
			const userEmail = profile.emails[0].value;
			//const userContactNumber = profile.phoneNumber[0].value;

			let user = await User.findOne({ userEmail: userEmail });

			if (!user) {
				user = new User({
					firstName: firstName,
					lastName: lastName,
					userEmail: userEmail,
					// userContactNumber: userContactNumber,
				});

				await user.save();
			}
			// Generate JWT token
			const token = jwt.sign(
				{
					id: user.id,
					firstName: user.firstName,
					userEmail: user.email,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "10h",
				}
			);

			console.log("Generated Token:", token);

			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
	}
);

passport.use(googleStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Register User
async function SignUp(req, res) {
	console.log("req.body", req.body);

	const data = {
		firstName: req.body.userFirstName,
		lastName: req.body.userLastName,
		userContactNumber: req.body.userContactNumber,
		userEmail: req.body.userEmail,
		password: req.body.userPassword,
	};

	if (
		!data.firstName ||
		!data.lastName ||
		!data.userContactNumber ||
		!data.userEmail ||
		!data.password
	) {
		return res.status(400).json({ error: "All Fields are required." });
	}

	try {
		const existingUser = await User.findOne({ userEmail: data.userEmail });
		if (existingUser) {
			return res.status(400).json({
				error: "User already exists. Please choose a different userEmail.",
			});
		}

		const saltRounds = 10;
		const hashedPassword = await hash(data.password, saltRounds);
		data.password = hashedPassword;

		const userData = await create(data);
		console.log(userData);
		return res
			.status(200)
			.send({ message: "User Registered Successfully", success: true });
	} catch (error) {
		console.error("Error during signup:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

// SignIn user
async function SignIn(req, res) {
	try {
		const existingUser = await User.findOne({ userEmail: req.body.userEmail });
		if (!existingUser) {
			return res.status(400).json({
				error:
					"No user found with the given email. Please make sure you have entered the correct email.",
			});
		}

		// Compare the hashed password from the database with the plaintext password
		const isPasswordMatch = await compare(
			req.body.userPassword,
			existingUser.password
		);
		if (!isPasswordMatch) {
			return res.status(400).json({
				error:
					"Please make sure you have entered the correct password for the provided email.",
			});
		}

		console.log("Existing User:", existingUser);

		const token = jwt.sign(
			{
				id: existingUser.id,
				firstName: existingUser.firstName,
				userEmail: existingUser.userEmail,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "10h",
			}
		);

		console.log("Generated Token:", token);

		res
			.status(200)
			.json({ message: "Sign In Successful", success: true, token });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: "Internal Server Error", details: error.stack });
	}
}

const auth = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.userId });
		if (!user) {
			return res.status(200).send({
				message: "user not found",
				success: false,
			});
		} else {
			res.status(200).send({
				success: true,
				data: {
					name: user.name,
					userEmail: user.userEmail,
				},
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "auth error",
			success: false,
			error,
		});
	}
};

// GOOGLE Calender
const oauth2Client = new google.auth.OAuth2(
	clientid,
	clientsecret,
	redirectCalenderurl
);

async function googleAuth(req, res) {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/calendar.events"],
	});
	res.redirect(url);
}

async function googleCallBack(req, res) {
	console.log("in calender callback");
	const { code } = req.query;
	const { tokens } = await oauth2Client.getToken(code);

	// Save the tokens to the database here
	const Id = "6624baeabff20c4463c501b4";
	const existingUser = await User.findById(Id);

	if (!existingUser) {
		return res.status(404).send("user not found");
	}
	existingUser.firstName = req.body.firstName || existingUser.firstName;
	existingUser.lastName = req.body.firstName || existingUser.lastName;
	existingUser.userContactNumber =
		req.body.userContactNumber || existingUser.userContactNumber;
	existingUser.userEmail = req.body.userEmail || existingUser.userEmail;
	existingUser.password = req.body.password || existingUser.password;
	existingUser.tokens = tokens;

	await existingUser.save();

	req.session.userId = Id;
	res.redirect("http://localhost:5173/schedulizer/Services");
	console.log("Authenticated successfully");
}

async function calenderEvents(req, res) {
	if (!req.session.userId) {
		return res.status(401).send("Not authenticated");
	}

	// Load the tokens from the database here
	const user = await User.findById(req.session.userId);
	oauth2Client.setCredentials(user.tokens);

	// Refresh the token if it's expired
	if (new Date().getTime() > user.tokens.expiry_date) {
		const { tokens } = await oauth2Client.refreshAccessToken();
		user.tokens = tokens;
		await user.save();
	}

	const calendar = google.calendar({ version: "v3", auth: oauth2Client });
	const event = {
		date: "2020-13-01",
		time: "10:59",
		summary: "summary",
		// summary: req.body.summary,
		// start: {
		//   dateTime: req.body.start,
		//   timeZone: "America/Los_Angeles",
		// },
		// end: {
		//   dateTime: req.body.end,
		//   timeZone: "America/Los_Angeles",
		// },
	};
	const createdEvent = await calendar.events.insert({
		calendarId: "primary",
		resource: event,
	});
	res.json(createdEvent.data);
}

// GOOGLE MEET
const oauthMeetClient = new google.auth.OAuth2(
	clientid,
	clientsecret,
	redirectMeeturl
);

async function googleMeetAuth(req, res) {
	const url = oauthMeetClient.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/calendar.events"],
	});
	res.redirect(url);
}

async function googleMeetCallBack(req, res) {
	const { code } = req.query;
	const { tokens } = await oauthMeetClient.getToken(code);

	// Save the tokens to the database here
	const Id = "6640e1d9842bb962271c5201";
	const existingUser = await User.findById(Id);

	if (!existingUser) {
		return res.status(404).send("user not found");
	}
	existingUser.firstName = req.body.firstName || existingUser.firstName;
	existingUser.lastName = req.body.firstName || existingUser.lastName;
	existingUser.userContactNumber =
		req.body.userContactNumber || existingUser.userContactNumber;
	existingUser.userEmail = req.body.userEmail || existingUser.userEmail;
	existingUser.password = req.body.password || existingUser.password;
	existingUser.tokens = req.body.token || existingUser.tokens;
	existingUser.meetTokens = tokens;

	await existingUser.save();

	// Set credentials for the Google Calendar API
	//oauth2Client.setCredentials(tokens)
	req.session.userId = Id;
	const user = await User.findById(req.session.userId);
	oauthMeetClient.setCredentials(user.meetTokens);
	// Refresh the token if it's expired
	if (new Date().getTime() > user.meetTokens.expiry_date) {
		const { tokens } = await oauthMeetClient.refreshAccessToken();
		user.meetTokens = tokens;
		await user.save();
	}

	const calendar = google.calendar({ version: "v3", auth: oauthMeetClient });

	//   const meeting = new Meeting({
	//     clientId: clientid,
	//     clientSecret: clientsecret,
	//     refreshToken: refreshToken,
	//     date: req.body.date,
	//     time: req.body.time,
	//     summary: req.body.summary,
	//     location: req.body.location,
	//     description: req.body.description,
	//     checking: 0,
	//   });
	const startDate = "2025-05-13";
	const startTime = "14:59";
	const endDate = "2025-05-13";
	const endTime = "15:29";
	// Create a new event with a Google Meet link
	const event = {
		summary: "New Meeting",
		start: {
			dateTime: `${startDate}T${startTime}:00`,
			timeZone: "Asia/Karachi",
		},
		end: {
			dateTime: `${endDate}T${endTime}:00`,
			timeZone: "Asia/Karachi",
		},
		conferenceData: {
			createRequest: {
				requestId: "sample123",
				conferenceSolutionKey: {
					type: "hangoutsMeet",
				},
			},
		},
	};

	const response = await calendar.events.insert({
		calendarId: "primary",
		resource: event,
		conferenceDataVersion: 1,
	});

	console.log(
		"Created a new event with a Google Meet link: ",
		response.data.hangoutLink
	);
	res.redirect("http://localhost:5173/schedulizer/services");
	console.log("Authenticated successfully");
}

const loginWithGoogle = passport.authenticate("google", {
	scope: ["profile", "email"],
});

const loginWithGoogleCallback = passport.authenticate("google", {
	successRedirect: "http://localhost:5173/schedulizer/services",
	failureRedirect: "http://localhost:5173/schedulizer/login",
});

export default {
	SignUp,
	SignIn,
	auth,
	loginWithGoogle,
	loginWithGoogleCallback,
	googleAuth,
	googleCallBack,
	calenderEvents,
	googleMeetAuth,
	googleMeetCallBack,
};
