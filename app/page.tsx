"use client";
import Grid from "@/components/common/Grid";
import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import EmployeeBirthmonthTableCard from "@/components/modules/dashboard/EmployeeBirthmonthTableCard";
import EmployeeContractEndingTableCard from "@/components/modules/dashboard/EmployeeContractEndingTableCard";
import SummaryCards from "@/components/modules/dashboard/SummaryCards";
import UserInformationCard from "@/components/modules/dashboard/UserInformationCard";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export default function Home() {

	const { permissions } = useContext(AuthContext);

	return (
		<Authenticated>
			<PageTitle
				title="Dashboard"
			/>
			{ permissions.includes("has_general_dashboard") &&
				<>
					<UserInformationCard/>
				</>
			}

			{ permissions.includes("has_analytic_dashboard_hr") &&
				<>
					<SummaryCards/>
					<Grid cols={3}>
						<div className="col-span-2">
							<EmployeeContractEndingTableCard/>
						</div>
						<EmployeeBirthmonthTableCard/>
					</Grid>
				</>
			}
		</Authenticated>
	);
};