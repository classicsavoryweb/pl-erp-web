import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import HolyLoader from "holy-loader";

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
				<ToastContainer/>
				<HolyLoader
					color="#E11D48"
					height="3px"
					speed={250}
					easing="linear"
					showSpinner
				/>
				{children}
			</body>
		</html>
	);
}
