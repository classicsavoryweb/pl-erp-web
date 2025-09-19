import Authenticated from "@/components/layouts/Authenticated";
import PayrollProvider from "@/context/PayrollProvider";

export default function Layout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<Authenticated>
			<PayrollProvider>
				{children}
			</PayrollProvider>
        </Authenticated>
	);
}
