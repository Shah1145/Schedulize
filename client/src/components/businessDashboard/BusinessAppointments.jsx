import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../Layout";
import AppointmentCard from "@cards/AppointmentCard";
import Filters from "../Filters";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function BusinessAppointments() {
	const [appointments, setAppointments] = useState([]);
	const [selectedSort, setSelectedSort] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const sortAppointments = useCallback(
		(appointments, sortOption, orderOption) => {
			let sortedAppointments = [...appointments];
			switch (sortOption) {
				case "NEWEST":
					sortedAppointments.sort(
						(a, b) => new Date(b.date) - new Date(a.date)
					);
					break;
				case "OLDEST":
					sortedAppointments.sort(
						(a, b) => new Date(a.date) - new Date(b.date)
					);
					break;
				case "MONTH":
					sortedAppointments.sort(
						(a, b) => new Date(a.date).getMonth() - new Date(b.date).getMonth()
					);
					break;
				case "YEAR":
					sortedAppointments.sort(
						(a, b) =>
							new Date(a.date).getFullYear() - new Date(b.date).getFullYear()
					);
					break;
				case "DURATION":
					sortedAppointments.sort((a, b) => a.duration - b.duration);
					break;
				default:
					break;
			}
			if (orderOption === "DESCENDING") {
				sortedAppointments.reverse();
			}
			return sortedAppointments;
		},
		[]
	);

	const fetchAppointments = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/appointments/all");
			let allAppointments = response.data.data;

			// Fetch the service for each appointment
			const appointmentsWithService = await Promise.all(
				allAppointments.map(async (appointment) => {
					// Extract the serviceId from the array
					const serviceId = appointment.serviceId[0];
					const serviceResponse = await axios.get(`/services/${serviceId}`);
					return { ...appointment, service: serviceResponse.data.data };
				})
			);

			// Sort appointments
			if (selectedSort.length > 0) {
				allAppointments = sortAppointments(
					appointmentsWithService,
					selectedSort[0],
					selectedOrder[0]
				);
			} else {
				allAppointments = appointmentsWithService;
			}

			setAppointments(allAppointments);
		} catch (error) {
			console.error("Fetch error: ", error);
		}
		setIsLoading(false);
	}, [selectedSort, selectedOrder, sortAppointments]);

	useEffect(() => {
		fetchAppointments(); // Fetch the services when the component mounts
	}, [fetchAppointments]);

	if (isLoading) {
		return (
			<Layout>
				<div className="pt-32 pb-6">
					<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
						ALL APPOINTMENTS.
					</h1>
				</div>

				<div className="flex flex-col py-6">
					<div className="flex justify-center">
						<Filters
							selectedFilters={selectedSort}
							setSelectedFilters={setSelectedSort}
							filterType="sort"
							filterName="Sort By"
						/>
						<Filters
							selectedFilters={selectedOrder}
							setSelectedFilters={setSelectedOrder}
							filterType="order"
							filterName="Order By"
						/>
					</div>

					<div className="flex flex-wrap justify-center items-center gap-12 px-12 py-16">
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								className="flex items-center space-x-2 appointment-card-skeleton"
							>
								<Skeleton
									height={80}
									width={100}
									baseColor="#667eea" // Indigo-500
									highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
									duration={2} // Speed of the animation
									enableAnimation
									borderRadius={16}
								></Skeleton>

								<Skeleton
									height={90}
									width={200}
									baseColor="#667eea" // Indigo-500
									highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
									duration={2} // Speed of the animation
									enableAnimation
									borderRadius={16}
								></Skeleton>
							</div>
						))}
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="pt-32 pb-6">
				<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
					ALL APPOINTMENTS.
				</h1>
			</div>

			<div className="flex flex-col py-6">
				<div className="flex justify-center">
					<Filters
						selectedFilters={selectedSort}
						setSelectedFilters={setSelectedSort}
						filterType="sort"
						filterName="Sort By"
					/>
					<Filters
						selectedFilters={selectedOrder}
						setSelectedFilters={setSelectedOrder}
						filterType="order"
						filterName="Order By"
					/>
				</div>

				<div className="flex flex-wrap justify-center items-center gap-12 px-6 py-16">
					{appointments.map((appointment) => (
						<div key={appointment._id}>
							<AppointmentCard
								appointment={appointment}
								businessName={appointment.businessName}
								serviceName={appointment.service.title}
								serviceType={appointment.service.type}
								isLoading={isLoading}
							/>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}

export default BusinessAppointments;
