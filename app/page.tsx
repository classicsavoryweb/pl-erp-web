import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import EmployeeBirthmonthTableCard from "@/components/modules/dashboard/EmployeeBirthmonthTableCard";
import SummaryCards from "@/components/modules/dashboard/SummaryCards";

export default function Home() {
	return (
		<Authenticated>
			<PageTitle
				title="Dashboard"
			/>
			<SummaryCards/>
			<EmployeeBirthmonthTableCard/>
		</Authenticated>
	);
};