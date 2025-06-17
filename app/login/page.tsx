import Card from "@/components/common/Card";
import Guest from "@/components/layouts/Guest";
import LoginForm from "@/components/modules/login/LoginForm";
import Image from "next/image";

const LoginPage = () => {
    return (
        <Guest>
            <div className="w-[400px]">
                <Card>
                    <div className="w-full flex justify-center pt-7">
                        <Image
                            src="/images/classic-savory.png"
                            width={200}
                            height={100}
                            alt="classic savory logo"
                        />
                    </div>

                    <p className="text-[16px] font-semibold text-red-800 text-center mt-[-20px] pb-10">{process.env.NEXT_PUBLIC_COMPANY}</p>

                    <hr className="text-slate-300"/>

                    <div className="py-5">
                        <p className="text-[16px] font-semibold text-red-800">Welcome!</p>
                        <p className="mt-[-5px] text-sm">Please sign in to continue.</p>
                    </div>

                    <LoginForm/>
                </Card>
            </div>
        </Guest>
    )
};

export default LoginPage;