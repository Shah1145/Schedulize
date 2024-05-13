import MemberCard from "@cards/MemberCard";
import teamData from "../data/teamData"; // Import your team data

function Team() {
	return (
		<div className="flex justify-center py-16 text-center">
			<div className="justify-center gap-24 grid xl:lg:grid-cols-2 px-2">
				{teamData.map((member, index) => (
					<MemberCard key={index} member={member} />
				))}
			</div>
		</div>
	);
}

export default Team;
