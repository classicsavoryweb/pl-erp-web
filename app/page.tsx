"use client";
import ActionDropDown from "@/components/common/ActionDropDown";
import Card from "@/components/common/Card";
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
				cols={3}
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
			</Grid>
		</Authenticated>
	);
};