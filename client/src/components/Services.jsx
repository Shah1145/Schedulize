import { useState, useEffect } from "react";
import Layout from "./Layout";
import Filters from "./Filters";
import ServiceCard from "@cards/ServiceCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Services() {
	const [services, setServices] = useState([]);
	const [businesses, setBusinesses] = useState([]);
	const [selectedDuration, setSelectedDuration] = useState([]);
	const [selectedPriceRange, setSelectedPriceRange] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]); // New state variable for selected categories
	const [isLoading, setIsLoading] = useState(true);
	const [isDataFetched, setIsDataFetched] = useState(false);

	// Fetch services and businesses here...
	useEffect(() => {
		setIsLoading(true);
		const fetchServices = async () => {
			try {
				const response = await fetch("/services/all");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const { data } = await response.json();
				// console.log("services data:", data);
				setServices(data);
			} catch (error) {
				console.error("Fetch error for services: ", error);
			}
		};

		const fetchBusinesses = async () => {
			try {
				const response = await fetch("/businesses/all");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setBusinesses(data);
				// console.log(data);
			} catch (error) {
				console.error("Fetch error: ", error);
			}
		};

		const fetchData = async () => {
			await fetchServices();
			await fetchBusinesses();
			setIsLoading(false);
			setIsDataFetched(true);
		};

		fetchData();
	}, []);

	const priceToNumber = (price) => Number(price.replace(/Rs\. |,/g, ""));

	const isWithinRange = (range, price) => {
		const [min, max] = range.split("-").map(priceToNumber);
		return price > min && price <= max;
	};

	const matchesPriceRange = (service) => {
		if (selectedPriceRange.length === 0) return true;
		return selectedPriceRange.some((range) =>
			isWithinRange(range, service.price)
		);
	};

	const matchesDuration = (service) => {
		if (selectedDuration.length === 0) return true;
		return selectedDuration.includes(service.duration[0]);
	};

	const matchesCategory = (service) => {
		// New filter function for categories
		if (selectedCategories.length === 0) return true;
		return selectedCategories.includes(service.category);
	};

	const filteredServices = services.filter(
		(service) =>
			matchesDuration(service) &&
			matchesPriceRange(service) &&
			matchesCategory(service) // Apply the new filter
	);

	if (isLoading) {
		return (
			<Layout>
				<div className="pt-32">
					<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
						SERVICES.
					</h1>
				</div>

				<Filters
					selectedFilters={selectedCategories}
					setSelectedFilters={setSelectedCategories}
					filterType="categories"
					filterName="Categories"
				/>

				<Filters
					selectedFilters={selectedDuration}
					setSelectedFilters={setSelectedDuration}
					filterType="duration"
					filterName="Duration"
				/>

				<Filters
					selectedFilters={selectedPriceRange}
					setSelectedFilters={setSelectedPriceRange}
					filterType="priceRanges"
					filterName="Price Range"
				/>

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
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="pt-32">
				<h1 className="flex justify-center font-bebas font-semibold text-8xl text-indigo-500 tracking-wide">
					SERVICES.
				</h1>
			</div>

			<Filters
				selectedFilters={selectedCategories}
				setSelectedFilters={setSelectedCategories}
				filterType="categories"
				filterName="Categories"
			/>

			<Filters
				selectedFilters={selectedDuration}
				setSelectedFilters={setSelectedDuration}
				filterType="duration"
				filterName="Duration"
			/>

			<Filters
				selectedFilters={selectedPriceRange}
				setSelectedFilters={setSelectedPriceRange}
				filterType="priceRanges"
				filterName="Price Range"
			/>

			<div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-16 py-12">
				{filteredServices.map((service, index) => {
					if (
						Array.isArray(service.businessId) &&
						service.businessId.length > 0
					) {
						const business =
							businesses &&
							businesses.find(
								(business) => business._id === String(service.businessId[0])
							);
						if (business) {
							return (
								<ServiceCard
									key={index}
									service={service}
									businessName={business.name}
									businessId={business._id}
								/>
							);
						}
					}
					return null;
				})}
				{isDataFetched && filteredServices.length === 0 && (
					<p className="py-12 font-muktaVaani text-lg text-red-500">
						No results found
					</p>
				)}
			</div>
		</Layout>
	);
}

export default Services;
