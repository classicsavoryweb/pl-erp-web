"use client";

import Card from "@/components/common/Card";
import { AuthContext } from "@/context/AuthProvider";
import Image from "next/image";
import { useContext } from "react";

const UserInformationCard = () => {
    const { userDetails } = useContext(AuthContext);

    return (
        <Card>
            <div className="flex justify-between">
                <div className="flex justify-start items-center gap-x-5">
                    <Image
                        src={"/images/profile-pic-male.svg"}
                        width={120}
                        height={120}
                        alt="profile picture"
                    />
                    <div>
                        <p className="text-2xl font-semibold text-red-700 pb-3">{userDetails.full_name || "—"}</p>
                        
                        <div className="flex gap-x-10">
                            <div>
                                <div className="flex justify-start gap-x-1">
                                    <p className=" font-semibold text-gray-500">Access Role:</p>
                                    <p className="">{String(userDetails.role_name).charAt(0).toUpperCase() + String(userDetails.role_name).slice(1) || "—"}</p>
                                </div>
                                <div className="flex justify-start gap-x-1">
                                    <p className=" font-semibold text-gray-500">Email:</p>
                                    <p className=" wrap-anywhere">{userDetails.email || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
};

export default UserInformationCard;