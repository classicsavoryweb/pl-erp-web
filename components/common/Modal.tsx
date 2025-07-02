"use client";

import Image from "next/image";
import LoadingState from "./LoadingState";
interface ModalInterface {
    size?: "sm" | "md" | "lg" | "xl" | "xxl" | "entireScreen";
    isShowing: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    loading?: boolean;
    error?: boolean;
};

const sizeClasses = {
    sm: "min-w-[400px] max-w-[400px]",
    md: "min-w-[500px] max-w-[500px]",
    lg: "min-w-[700px] max-w-[700px]",
    xl: "min-w-[900px] max-w-[900px]",
    xxl: "min-w-[1200px] max-w-[1200px]",
    entireScreen: "min-w-[75%] max-w-[75%]",
};

const Modal = ({
    size = "md",
    isShowing = false,
    title,
    onClose,
    children,
    loading = false,
    error = false
}: ModalInterface) => {

    return (
        isShowing &&
        <div className="h-screen w-screen fixed inset-0 z-50 flex justify-center items-start py-5 bg-black/70 overflow-auto">
            <div
                className={`bg-zinc-50 rounded shadow-lg w-full ${sizeClasses[size]} px-5 py-3 relative`}
            >
                <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-4">
                    <p className="text-md font-semibold">{title}</p>
                    <button
                        className="text-gray-500 hover:text-gray-800 text-2xl hover:cursor-pointer"
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
                        : 
                        error
                        ?
                            <div className="flex justify-center items-center h-[30vh]">
                                <div>
                                    <Image
                                        width={200}
                                        height={200}
                                        alt="error image"
                                        src="/images/error_state.svg"
                                    />
                                    <p className="text-center mt-5">
                                        Something went wrong...
                                    </p>
                                </div>
                            </div>
                        :
                            <>
                                {children}
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Modal;