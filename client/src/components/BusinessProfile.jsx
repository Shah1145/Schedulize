import ServiceCard from "@cards/ServiceCard";
import BackToTopButton from "./BackToTopButton";
// import Ratings from "./Ratings";
// import InputField from "./form/InputField";
import Layout from "./Layout";
// import Button from "./Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BusinessInfoCard from "@cards/BusinessInfoCard";
// import GoogleMapView from "@data-visualization/GoogleMapView";

function BusinessInfo() {
	const { businessName } = useParams();
	const [business, setBusiness] = useState([]);
	const [services, setServices] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const imagePath = business.profilePicture
		? business.profilePicture.replace("public/", "/backend/public/")
		: "";

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				const response = await fetch(`/businesses/all`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const businessData = await response.json();
				const matchingBusiness = businessData.find(
					(business) => business.name === businessName
				);
				setBusiness(matchingBusiness);

				const servicesResponse = await fetch("/services/all");
				if (!servicesResponse.ok) {
					throw new Error(`HTTP error! status: ${servicesResponse.status}`);
				}
				const servicesData = await servicesResponse.json();
				console.log("servicesData: ", servicesData.data);

				servicesData.data.forEach((service) => {
					console.log("Service business id: ", service.businessId);
				});

				const matchingServices = servicesData.data.filter((service) =>
					service.businessId.includes(matchingBusiness._id)
				);

				console.log("matching services:", matchingServices);
				setServices(matchingServices);
			} catch (error) {
				console.error("Fetch error: ", error);
			}
		};
		setIsLoading(false);

		fetchData(businessName);
	}, [businessName]); // Removed 'business' from the dependency array

	if (isLoading) {
		return (
			<Layout>
				<div className="pt-32 pb-12">
					<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
						BUSINESS INFO.
					</h1>

					<div className="flex justify-center items-center space-x-6 py-12">
						<Skeleton
							height={280}
							width={450}
							baseColor="#667eea" // Indigo-500
							highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
							duration={2} // Speed of the animation
							enableAnimation
							borderRadius={14}
						></Skeleton>
					</div>

					<div className="py-12">
						<h1 className="flex justify-center font-bebas font-semibold text-6xl text-indigo-500 tracking-wide">
							SERVICES.
						</h1>
						<div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-16 py-12">
							{[...Array(10)].map((_, i) => (
								<div key={i} className="appointment-card-skeleton">
									<Skeleton
										height={320}
										width={380}
										baseColor="#667eea" // Indigo-500
										highlightColor="#7f9cf5" // A lighter shade of Indigo for the animation highlight
										duration={2} // Speed of the animation
										enableAnimation
										borderRadius="1rem"
									></Skeleton>
								</div>
							))}
						</div>
					</div>
				</div>
				<BackToTopButton />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="pt-32 pb-12">
				<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
					BUSINESS INFO.
				</h1>

				<div className="flex justify-center items-center space-x-6 py-12">
					<BusinessInfoCard business={business} imagePath={imagePath} />
					{/* <GoogleMapView
						mapLink="https://maps.app.goo.gl/cH5PnPJFtyjw5KUF9"
						businessName={businessName}
						zoom={10} // Add this line
						center={{ lat: 37.7749, lng: -122.4194 }} // Add this line, replace with your desired coordinates
					/> */}
				</div>

				<div className="py-12">
					<h1 className="flex justify-center font-bebas font-semibold text-6xl text-indigo-500 tracking-wide">
						SERVICES.
					</h1>
					<div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-16 py-12">
						{services &&
							services.map((service, index) => (
								<ServiceCard
									key={index}
									service={service}
									businessName={business.name}
								/>
							))}
					</div>
				</div>
			</div>
			<BackToTopButton />
		</Layout>
	);
}

export default BusinessInfo;
