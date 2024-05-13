import { useSelector } from "react-redux";
import Layout from "../Layout";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppointmentCard from "@cards/AppointmentCard";
import Button from "@components/Button";
import BarChart from "@data-visualization/BarChart";
import PieDoughnutChart from "@data-visualization/PieDoughnutChart";
import DotsChart from "@data-visualization/DotsChart";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TransitionModal from "@components/TransitionModal";

function CustomerDashboard() {
	const { auth, user, service } = useSelector((state) => ({
		auth: state.auth,
		user: state.user,
		service: state.service,
	}));
	console.log(auth, user, service);

	const selectedUser = user.userData;
	const userName = selectedUser?.name;
	const isUserSignedIn = useSelector((state) => state.user.isUserSignedIn);

	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	// const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isUserSignedIn && !auth.isAuthenticated) {
			setIsModalOpen(true);
			setTimeout(() => {
				navigate("/schedulizer/signin");
			}, 4000); // 4000 milliseconds = 4 seconds
		}
	}, [isUserSignedIn, navigate, auth.isAuthenticated]);

	const closeModalAndNavigate = () => {
		setIsModalOpen(false);
	};

	const [appointments, setAppointments] = useState([]);

	const fetchAppointments = useCallback(async () => {
		// setIsLoading(true);
		try {
			const response = await axios.get("/appointments/all");
			const allAppointments = response.data.data;

			// Fetch the service for each appointment
			const appointmentsWithService = await Promise.all(
				allAppointments.map(async (appointment) => {
					// Extract the serviceId from the array
					const serviceId = appointment.serviceId[0];
					const serviceResponse = await axios.get(`/services/${serviceId}`);
					console.log(serviceResponse.data); // Add this line
					return { ...appointment, service: serviceResponse.data.data };
				})
			);

			setAppointments(appointmentsWithService);
		} catch (error) {
			console.error("Fetch error: ", error);
		}
		// setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchAppointments(); // Fetch the services when the component mounts
	}, [fetchAppointments]);

	// if (isLoading) {
	// 	return (
	// 		<Layout>
	// 			<div className="pt-32 pb-6">
	// 				<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
	// 					BUSINESS DASHBOARD.
	// 				</h1>
	// 			</div>

	// 			<div className="flex justify-center items-center space-x-32 py-6">
	// 				<Skeleton
	// 					height={280}
	// 					width={450}
	// 					baseColor="#667eea" // Indigo-500
	// 					highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
	// 					duration={2} // Speed of the animation
	// 					enableAnimation
	// 					borderRadius={14}
	// 				></Skeleton>

	// 				<div className="flex flex-col justify-center space-y-4">
	// 					<div className="flex justify-center space-x-6">
	// 						<div className="flex flex-col justify-center space-y-2">
	// 							<Skeleton
	// 								height={200}
	// 								width={300}
	// 								baseColor="#667eea" // Indigo-500
	// 								highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
	// 								duration={2} // Speed of the animation
	// 								enableAnimation
	// 								borderRadius={14}
	// 							></Skeleton>

	// 							<p className="font-medium font-poppins text-center text-sm">
	// 								Another SatiGraphsfaction
	// 							</p>
	// 						</div>

	// 						<div className="flex flex-col justify-center space-y-2">
	// 							<Skeleton
	// 								height={200}
	// 								width={300}
	// 								baseColor="#667eea" // Indigo-500
	// 								highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
	// 								duration={2} // Speed of the animation
	// 								enableAnimation
	// 								borderRadius={14}
	// 							></Skeleton>

	// 							<p className="font-medium font-poppins text-center text-sm">
	// 								Customer Satisfaction
	// 							</p>
	// 						</div>
	// 					</div>

	// 					<div className="flex flex-col justify-center space-y-2">
	// 						<DotsChart
	// 							width={620}
	// 							height={150}
	// 							bgColour="#6875F5"
	// 							pathsColour="#FAF8ED"
	// 						/>

	// 						<p className="font-medium font-poppins text-center text-sm">
	// 							Customer Growth
	// 						</p>
	// 					</div>
	// 				</div>
	// 			</div>

	// 			<div className="flex flex-col space-y-12 py-16">
	// 				<h1 className="flex justify-center font-bebas font-semibold text-6xl text-indigo-500 tracking-wide">
	// 					UPCOMING APPOINTMENTS.
	// 				</h1>

	// 				<div className="flex justify-center">
	// 					<Button
	// 						buttonName="VIEW ALL"
	// 						buttonLink="/schedulizer/userDashboard/${userName}/appointments"
	// 					/>
	// 				</div>

	// 				<div className="flex border-indigo-500 border-x-2 mx-12 py-1 pl-6 overflow-x-auto">
	// 					<div className="flex flex-nowrap space-x-6">
	// 						{[...Array(5)].map((_, i) => (
	// 							<div
	// 								key={i}
	// 								className="flex items-center space-x-2 appointment-card-skeleton"
	// 							>
	// 								<Skeleton
	// 									height={80}
	// 									width={100}
	// 									baseColor="#667eea" // Indigo-500
	// 									highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
	// 									duration={2} // Speed of the animation
	// 									enableAnimation
	// 									borderRadius={16}
	// 								></Skeleton>

	// 								<Skeleton
	// 									height={90}
	// 									width={200}
	// 									baseColor="#667eea" // Indigo-500
	// 									highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
	// 									duration={2} // Speed of the animation
	// 									enableAnimation
	// 									borderRadius={16}
	// 								></Skeleton>
	// 							</div>
	// 						))}
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</Layout>
	// 	);
	// }

	return (
		<Layout>
			<div className="pt-32 pb-6">
				<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
					CUSTOMER DASHBOARD.
				</h1>
			</div>

			<div className="flex justify-center items-center space-x-32 py-6">
				<div className="flex flex-col justify-center space-y-4">
					<div className="flex justify-center space-x-6">
						<div className="flex flex-col justify-center space-y-2">
							<BarChart
								width={300}
								height={200}
								events={true}
								bgColour="#6875F5"
								pathsColour="#FAF8ED"
							/>

							<p className="font-medium font-poppins text-center text-sm">
								Another SatiGraphsfaction
							</p>
						</div>

						<div className="flex flex-col justify-center space-y-2">
							<PieDoughnutChart
								width={300}
								height={200}
								events={true}
								bgColour="#6875F5"
								pathsColour="#FAF8ED"
								satisfactionPercentage={70}
							/>

							<p className="font-medium font-poppins text-center text-sm">
								Customer Satisfaction
							</p>
						</div>
					</div>

					<div className="flex flex-col justify-center space-y-2">
						<DotsChart
							width={620}
							height={150}
							bgColour="#6875F5"
							pathsColour="#FAF8ED"
						/>

						<p className="font-medium font-poppins text-center text-sm">
							Customer Growth
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col space-y-12 py-16">
				<h1 className="flex justify-center font-bebas font-semibold text-6xl text-indigo-500 tracking-wide">
					UPCOMING APPOINTMENTS.
				</h1>

				<div className="flex justify-center">
					<Button
						buttonName="VIEW ALL"
						buttonLink={`/schedulizer/userDashboard/${userName}/appointments`}
					/>
				</div>

				<div className="flex flex-wrap justify-center gap-6 px-6">
					{appointments.slice(0, 5).map((appointment) => (
						<div key={appointment._id} className="flex-shrink-0">
							<AppointmentCard
								appointment={appointment}
								businessName={appointment.businessName}
								serviceName={appointment.service.title}
							/>
						</div>
					))}
				</div>
			</div>

			<TransitionModal
				isOpen={isModalOpen}
				onClose={closeModalAndNavigate}
				title="DASHBOARD ACCESS DENIED."
				description="You&rsquo;re not signed in. Please sign in again to access the dashboard."
				className="pattern-topography-[#FAF8ED]/40 pattern-topography-scale-[0.5] z-10 fixed inset-0 bg-indigo-600 overflow-y-auto"
			/>
		</Layout>
	);
}

export default CustomerDashboard;
