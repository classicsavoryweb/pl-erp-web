"use client";

import Image from "next/image";

const Authenticated = ({
    children
}: {
    children : React.ReactNode;
}) => {
    return (
        <div
            className="h-screen w-full flex"
        >
            <div className="bg-white h-full w-[300px] border-r-1 border-slate-300">
                <div className="w-full flex justify-center py-2">
                    <Image
                        alt="classic savory logo"
                        src="/images/classic-savory.png"
                        width={150}
                        height={100}
                    />
                </div>
            </div>
            <div className="w-full h-screen">
                <div className="bg-white border-b-1 border-slate-300 h-[9vh]">
                    {/* HEADER */}
                </div>
                <div className="h-[91vh] max-h-[91vh] overflow-auto p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Authenticated;