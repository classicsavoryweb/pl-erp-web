// "use client";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import HolyLoader from "holy-loader";
import AuthProvider from "@/context/AuthProvider";
import { Metadata } from "next";
// import { CookiesProvider } from "react-cookie"

export const metadata: Metadata = {
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
					color="#fda4af"
					height="3px"
					speed={250}
					easing="linear"
					showSpinner
				/>
					<AuthProvider>
						{children}
					</AuthProvider>
			</body>
		</html>
	);
}
