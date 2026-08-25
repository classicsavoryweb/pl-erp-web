"use client";

import { login } from "@/api/authentication";
import Button from "@/components/common/Button";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter();

    const loginHandler = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            email: Yup.string().required("Email is required."),
            password: Yup.string().required("Password is required.")
        }),
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);
            login(values)
                .then((resp) => {
                    if (resp.error) {
                        toast.error(resp.data.message);
                    } else {
                        const expiresInHours = 12 / 24;
                        const user = resp.data.user;
                        const employee = resp.data.employee;
                        // const {
                        //     employee_status,
                        //     home_branch,
                        //     schedule,
                        //     current_position,
                        //     ...filteredData
                        // } = user;

                        const permissions = resp.data.permissions || [];
                        const chunkSize = 100;
                        const partitionedPermissions = [];

                        for (let i = 0; i < permissions.length; i += chunkSize) {
                        partitionedPermissions.push(permissions.slice(i, i + chunkSize));
                        }

                        partitionedPermissions.forEach((chunk, index) => {
                            Cookies.set(`permissions_${index}`, JSON.stringify(chunk), { path: '/', expires: expiresInHours });
                        });
                        Cookies.set('authToken', resp.data.token, { path: '/', expires: expiresInHours });
                        Cookies.set('userDetails', JSON.stringify(user), { path: '/', expires: expiresInHours });
                        Cookies.set('employeeDetails', JSON.stringify(employee), { path: '/', expires: expiresInHours });
                        router.push("/");
                    }
                })
                .catch((err) => {
                    toast.error("Error encountered");
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    });

    return (
        <form onSubmit={loginHandler.handleSubmit}>
            <Textfield
                label="Email"
                required
                name="email"
                type="email"
                placeholder="enter email"
                onChange={loginHandler.handleChange}
                value={loginHandler.values.email}
                error={loginHandler.errors.email}
            />
            <Textfield
                label="Password"
                required
                name="password"
                type="password"
                placeholder="enter password"
                onChange={loginHandler.handleChange}
                value={loginHandler.values.password}
                error={loginHandler.errors.password}
            />
            <Button
                label="Sign in"
                type="submit"
                loading={loginHandler.isSubmitting}
                onClick={() => {}}
            />
        </form>
    );
};

export default LoginForm;