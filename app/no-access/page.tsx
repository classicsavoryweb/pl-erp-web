"use client";
import Button from "@/components/common/Button";
import Guest from "@/components/layouts/Guest";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {

    const router = useRouter();

    return (
        <Guest>
            <div>
                <Image
                    src="images/no-access.svg"
                    width={300}
                    height={300}
                    alt="no access logo"
                />
                <p className="py-2 text-center dark:text-slate-100">You cannot access this page</p>
                <Button
                    label="Go back"
                    onClick={() => {
                        if(window.history.length > 1) {
                            router.back();
                        } else {
                            router.push("/");
                        }
                    }}
                />
            </div>
        </Guest>   
    );
};

export default Page;