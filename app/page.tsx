"use client";
import Modal from "@/components/common/Modal";
import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import SummaryCardCount from "@/components/modules/dashboard/SummaryCardCount";

export default function Home() {
	return (
		<Authenticated>
			<PageTitle
				title="Dashboard"
			/>
			<div className="grid grid-cols-3 gap-x-5">
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
			</div>
		</Authenticated>
	);
}