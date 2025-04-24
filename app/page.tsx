import Card from "@/components/common/Card";
import PageTitle from "@/components/common/PageTitle";
import Table from "@/components/common/Table";
import Authenticated from "@/components/layouts/Authenticated";
import { COLUMNTYPES } from "@/constants/column";
import Image from "next/image";

export default function Home() {
	return (
		<Authenticated>

			<PageTitle
				title="Dashboard"
			/>
			<div className="grid grid-cols-3 gap-x-5">
				<Card>
					<p className="text-md font-medium">Contractual Employees</p>
					<p className="text-3xl text-red-600 font-medium">0</p>
				</Card>

				<Card>
					<p className="text-md font-medium">Regulary Employees</p>
					<p className="text-3xl text-red-600 font-medium">0</p>
				</Card>

				<Card>
					<p className="text-md font-medium">Probationary Employees</p>
					<p className="text-3xl  text-red-600 font-medium">0</p>
				</Card>
			</div>
		</Authenticated>
	);
}
