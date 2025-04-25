"use client";

import Image from "next/image";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Authenticated = ({
    children
}: {
    children : React.ReactNode;
}) => {
    return (
        <div className="h-screen w-screen flex">
            <div className="bg-zinc-50 h-full w-[330px] border-r-1 border-slate-300">
                <div className="w-full flex justify-center py-2">
                    <Image
                        alt="classic savory logo"
                        src="/images/classic-savory.png"
                        width={150}
                        height={100}
                    />
                </div>

                <div className="w-full px-2">
                    <hr className="text-slate-300"/>
                </div>
                <Sidebar/>
            </div>
            <div className="w-full h-screen">
                <div className="w-full bg-zinc-50 border-b-1 flex justify-end items-center border-slate-300 h-[9vh] px-5">
                    <Header/>
                </div>
                <div className="w-full h-[91vh] max-h-[91vh] p-5 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Authenticated;