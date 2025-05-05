import Authenticated from "@/components/layouts/Authenticated";

export default function Layout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<Authenticated>
            {children}
        </Authenticated>
	);
}
