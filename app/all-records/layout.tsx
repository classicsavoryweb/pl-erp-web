import Authenticated from "@/components/layouts/Authenticated";
import EmployeeProvider from "@/context/EmployeeProvider";

export default function Layout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<Authenticated>
			<EmployeeProvider>
				{children}
			</EmployeeProvider>
        </Authenticated>
	);
}
