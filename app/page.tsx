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
		</Authenticated>
	);
}
