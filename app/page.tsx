import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import EmployeeBirthmonthTableCard from "@/components/modules/dashboard/EmployeeBirthmonthTableCard";
import EmployeeContractEndingTableCard from "@/components/modules/dashboard/EmployeeContractEndingTableCard";
import SummaryCards from "@/components/modules/dashboard/SummaryCards";

export default function Home() {
	return (
		<Authenticated>
			<PageTitle
				title="Dashboard"
			/>
			<SummaryCards/>
			<Grid cols={3}>
				<div className="col-span-2">
					<EmployeeContractEndingTableCard/>
				</div>
				<EmployeeBirthmonthTableCard/>
			</Grid>
		</Authenticated>
	);
};