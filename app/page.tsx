"use client";
import Grid from "@/components/common/Grid";
import PageTitle from "@/components/common/PageTitle";
import Authenticated from "@/components/layouts/Authenticated";
import EmployeeAnniversary from "@/components/modules/dashboard/EmployeeAnniversaryTableCard";
import ItemCriticalLevel from "@/components/modules/dashboard/ItemCriticalLevelTableCard";
import SummaryCardUniform from "@/components/modules/dashboard/SummaryCardUniform";
import EmployeeBirthmonthTableCard from "@/components/modules/dashboard/hr/EmployeeBirthmonthTableCard";
import EmployeeContractEndingTableCard from "@/components/modules/dashboard/hr/EmployeeContractEndingTableCard";
import SummaryCards from "@/components/modules/dashboard/hr/SummaryCards";
import PayrollSummaryCards from "@/components/modules/dashboard/payroll/PayrollSummaryCards";
import UserInformationCard from "@/components/modules/dashboard/UserInformationCard";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import EmployeeForLastPayTableCard from "@/components/modules/dashboard/payroll/EmployeeForLastPayTableCard";
import BranchesWithMissingAccountsTableCard from "@/components/modules/dashboard/payroll/BranchesWithMissingAccountsTableCard";

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

			{ permissions.includes("has_uniform_dashboard") &&
				<>
					<SummaryCardUniform />
					<Grid cols = {2}>
						<ItemCriticalLevel />
						<div className="col-span-1">
							<EmployeeAnniversary />
						</div>
					</Grid>
				</>
			}

			{ permissions.includes("has_analytic_dashboard_payroll") &&
				<>
					<PayrollSummaryCards/>
					<Grid cols={3}>
						<div className="col-span-2">
							<EmployeeForLastPayTableCard/>
						</div>
						<BranchesWithMissingAccountsTableCard/>
					</Grid>
				</>
			}
		</Authenticated>
	);
};