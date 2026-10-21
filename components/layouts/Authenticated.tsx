"use client";

import Image from "next/image";
import Header from "./Header";
import Sidebar from "./Sidebar"

const Authenticated = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-screen">
            <div className="w-full bg-blue-950 border-b border-slate-400/30 h-[8vh] max-h-[8vh] px-5 flex items-center justify-between shadow">
                <div className="flex justify-start items-center gap-x-3">
                    <Image
                        src="/images/photoline.png"
                        width={300}
                        height={100}
                        alt="photoline logo"
                        className="invert brightness-0"
                    />
                </div>
                <Header />
            </div>
            <div className="flex h-[92vh]">
                <div className="overflow-auto pb-5 shadow bg-zinc-50 min-w-[220px] max-w-[220px] minimal-scroll dark:bg-neutral-900">
                    <Sidebar />
                </div>
                <div className="flex-1 overflow-auto pb-7 shadow w-full p-4 dark:bg-neutral-800">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Authenticated;
