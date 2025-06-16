"use client";
import Button from "@/components/common/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {

    const router = useRouter();

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div>
                <Image
                    src="images/no-access.svg"
                    width={300}
                    height={300}
                    alt="no access logo"
                />
                <p className="py-2 text-center">You cannot access this page</p>
                <Button
                    label="Go back"
                    onClick={() => {
                        router.back();
                    }}
                />
            </div>
        </div>   
    );
};

export default Page;