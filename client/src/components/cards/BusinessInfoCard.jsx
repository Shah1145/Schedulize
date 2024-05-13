import PropTypes from "prop-types";
import VanillaTilt from "@components/VanillaTilt";

function BusinessInfoCard({ business, imagePath }) {
	return (
		<VanillaTilt
			options={{
				max: 3,
				scale: 1.01,
				perspective: 500,
				speed: 800,
				transformStyle: "preserve-3d",
			}}
		>
			<div
				className="flex flex-col justify-center items-center space-y-6 border-2 border-indigo-500 bg-[#FAF8ED] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-8 rounded-2xl break-words group"
				style={{
					transformStyle: "preserve-3d",
					transform: "perspective(1000px)",
				}}
			>
				<div className="flex flex-col justify-center items-center space-y-4">
					<img
						className="border-2 border-black rounded-full w-20 h-20"
						src={imagePath}
						alt="Profile"
					/>
					<div className="flex flex-col justify-center items-center">
						<div className="font-poppins font-semibold text-black text-lg">
							{business.name}
						</div>
						<div className="flex justify-between space-x-6">
							<div className="font-muktaVaani text-black text-xs">
								{business.category}
							</div>
							<div className="font-muktaVaani text-black text-xs">
								{business.city}
							</div>
							<div className="font-muktaVaani text-black text-xs">
								Rating: 4.5 / 5
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-center items-center w-96 font-muktaVaani font-normal text-black text-center text-sm">
					{business.bio}
				</div>
			</div>
		</VanillaTilt>
	);
}

BusinessInfoCard.propTypes = {
	business: PropTypes.shape({
		name: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		bio: PropTypes.string.isRequired,
	}).isRequired,
	imagePath: PropTypes.string.isRequired,
};

export default BusinessInfoCard;
