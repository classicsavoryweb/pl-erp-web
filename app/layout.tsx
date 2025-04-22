import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  	title: "Classic Savory ERP",
  	description: "A web-based entity resource planning application for classic savory",
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
