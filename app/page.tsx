import Grid from "@/components/common/Grid";
import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import SummaryCardCount from "@/components/modules/dashboard/SummaryCardCount";

export default function Home() {
	return (
		<Authenticated>
			<PageTitle
				title="Dashboard"
			/>
			<Grid
				cols={4}
			>
				<SummaryCardCount
					title="Contractual Employees"
					displayReport={0}
				/>
				<SummaryCardCount
					title="Regular Employees"
					displayReport={0}
				/>
				<SummaryCardCount
					title="Probationary Employees"
					displayReport={0}
				/>
				<SummaryCardCount
					title="Branches"
					displayReport={0}
				/>
			</Grid>
		</Authenticated>
	);
};