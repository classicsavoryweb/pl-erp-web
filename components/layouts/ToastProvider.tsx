"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export default function ToastProvider() {
    const { resolvedTheme } = useTheme();

    return (
        <ToastContainer
            theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    );
}