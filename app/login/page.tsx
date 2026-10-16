import Card from "@/components/common/Card";
import Guest from "@/components/layouts/Guest";
import LoginForm from "@/components/modules/login/LoginForm";
import Image from "next/image";

const LoginPage = () => {
    return (
        <Guest>
            <title>Classic Savory ERP</title>
            <div className="w-[400px]">
                <Card>
                    <div className="w-full flex justify-center py-10">
                        <Image
                            src="/images/photoline.png"
                            width={300}
                            height={100}
                            alt="photoline logo"
                            className="dark:invert dark:brightness-0"
                        />
                    </div>

                    <hr className="text-slate-300"/>

                    <div className="py-5">
                        <p className="text-[15px] font-semibold text-blue-950 dark:text-slate-100">Welcome!</p>
                        <p className="mt-[-5px] ">Please sign in to continue.</p>
                    </div>

                    <LoginForm/>
                </Card>
            </div>
        </Guest>
    )
};

export default LoginPage;