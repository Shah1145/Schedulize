import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import SignIn from "@components/SignIn.jsx";
import SignUp from "@components/Signup.jsx";
import BusinessRegistrationForm from "@components/BusinessRegistration.jsx";
import Dashboard from "@components/BusinessDashboard/Dashboard.jsx";
import CustomerDashboard from "@components/CustomerDashboard/CustomerDashboard.jsx";
import BusinessInfo from "@components/BusinessProfile.jsx";
import Services from "@components/Services.jsx";
import Businesses from "@components/Businesses.jsx";
import Home from "@components/Home.jsx";
import Tests from "@components/Tests.jsx";
import store from "./redux/store/store.js";
import AppointmentForm from "@components/AppointmentForm.jsx";
import BusinessServices from "@components/BusinessDashboard/BusinessServices.jsx";
import BusinessAppointments from "@components/BusinessDashboard/BusinessAppointments.jsx";
import BusinessAnalytics from "@components/BusinessDashboard/BusinessAnalytics.jsx";
import GoogleCalendarConnect from "@components/GoogleCalendarConnect.jsx";
// import SmoothScroll from "@components/SmoothScroll.jsx";
// import * as Sentry from "@sentry/react";

// Sentry.init({
// 	dsn: "https://6dbbfb8388d2d22d223a12316d224203@o4507190924738560.ingest.de.sentry.io/4507190934962256",
// 	integrations: [
// 		Sentry.browserTracingIntegration(),
// 		Sentry.replayIntegration(),
// 	],
// 	// Performance Monitoring
// 	tracesSampleRate: 1.0, //  Capture 100% of the transactions
// 	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
// 	tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
// 	// Session Replay
// 	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
// 	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			{/* <SmoothScroll /> */}
			<BrowserRouter>
				<Routes>
					<Route path="/schedulizer/" element={<Home />} />
					<Route
						path="/schedulizer/BusinessDashboard/:businessName"
						element={<Dashboard />}
					/>
					<Route
						path="/schedulizer/CustomerDashboard/:firstName"
						element={<CustomerDashboard />}
					/>
					<Route path="/schedulizer/Businesses" element={<Businesses />} />{" "}
					<Route
						path="/schedulizer/googlecalendarconnect"
						element={<GoogleCalendarConnect />}
					/>
					<Route path="/schedulizer/Services" element={<Services />} />
					<Route path="/schedulizer/SignIn" element={<SignIn />} />
					<Route path="/schedulizer/SignUp" element={<SignUp />} />
					<Route path="/schedulizer/Tests" element={<Tests />} />
					<Route
						path="/schedulizer/BusinessRegistration"
						element={<BusinessRegistrationForm />}
					/>
					<Route
						path="/schedulizer/BusinessProfile/:businessName"
						element={<BusinessInfo />}
					/>
					<Route
						path="/schedulizer/AppointmentForm/:businessName/:serviceName"
						element={<AppointmentForm />}
					/>
					<Route
						path="/schedulizer/BusinessDashboard/:businessName/services"
						element={<BusinessServices />}
					/>
					<Route
						path="/schedulizer/BusinessDashboard/:businessName/appointments"
						element={<BusinessAppointments />}
					/>
					<Route
						path="/schedulizer/BusinessDashboard/:businessName/analytics"
						element={<BusinessAnalytics />}
					/>
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
