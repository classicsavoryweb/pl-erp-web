"use client";

import LoadingState from "./LoadingState";

interface ModalInterface {
    size?: "sm" | "md" | "lg" | "xl";
    isShowing: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    loading?: boolean;
};

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

const Modal = ({
    size = "md",
    isShowing = false,
    title,
    onClose,
    children,
    loading = false,
}: ModalInterface) => {
    return (
        isShowing &&
        <div className="h-screen w-screen fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black/70">
            <div
                className={`bg-zinc-50 rounded shadow-lg w-full ${sizeClasses[size]} p-5 relative`}
            >
                <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-4">
                    <p className="text-md font-semibold">{title}</p>
                    <button
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div>
                    { loading
                        ? <div className="flex justify-center">
                            <LoadingState/>
                        </div>
                        : children}
                </div>
            </div>
        </div>
    );
};

export default Modal;