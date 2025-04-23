import Card from "@/components/common/Card";
import LoginForm from "@/components/forms/auth/LoginForm";
import Guest from "@/components/layouts/Guest";
import Image from "next/image";

const LoginPage = () => {
    return (
        <Guest>
            <div className="w-[400px]">
                <Card>
                    <div className="w-full flex justify-center p-7">
                        <Image
                            src="/images/classic-savory.png"
                            width={200}
                            height={100}
                            alt="classic savory logo"
                        />
                    </div>
                    
                    <hr className="text-slate-300"/>

                    <div className="py-5">
                        <p className="text-2xl font-semibold text-red-600">Welcome!</p>
                        <p className="mt-[-5px]">Please sign in to continue.</p>
                    </div>

                    <LoginForm/>
                </Card>
            </div>
        </Guest>
    )
};

export default LoginPage;