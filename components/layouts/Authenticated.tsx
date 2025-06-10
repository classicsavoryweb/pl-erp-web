"use client";

import Image from "next/image";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Authenticated = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen max-h-screen w-full flex overflow-hidden">
            <div className="bg-zinc-50 min-w-[260px] max-w-[260px] border-r border-slate-400/30 flex flex-col">
                <div className="w-full flex justify-center py-3">
                    <Image
                        alt="classic savory logo"
                        src="/images/classic-savory.png"
                        width={120}
                        height={100}
                    />
                </div>


                <div className="flex-1 overflow-auto pb-5 shadow">
                    <Sidebar />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
                <div className="w-full bg-zinc-50 border-b border-slate-400/30 h-[9vh] max-h-[9vh] px-5 flex items-center justify-end shadow">
                    <Header />
                </div>
                <div className="flex-1 overflow-auto p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Authenticated;
