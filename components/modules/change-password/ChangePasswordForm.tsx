"use client";

import { changePassword } from "@/api/authentication";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ChangePasswordForm = () => {

    const formHandler = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            old_password: Yup.string().required("Old password is required."),
            new_password: Yup.string().required("New password is required."),
            confirm_password: Yup.string().required("Confirm password is required.")
                .oneOf([Yup.ref('new_password')], "Passwords must match."),
        }),
        onSubmit: (values, {setSubmitting, setErrors, resetForm}) => {
            setSubmitting(true);
            changePassword(values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Password updated successfully");
                    resetForm();
                } else {
                    setErrors(resp.data);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });
    return (
        <Card
            as="form"
            handleSubmit={formHandler.handleSubmit}
        >
            <Textfield
                type="password"
                onChange={formHandler.handleChange}
                label="Old Password"
                placeholder="enter old password"
                name="old_password"
                value={formHandler.values.old_password}
                error={formHandler.errors.old_password}
                required
            />

            <Textfield
                type="password"
                onChange={formHandler.handleChange}
                label="New Password"
                placeholder="enter new password"
                name="new_password"
                value={formHandler.values.new_password}
                error={formHandler.errors.new_password}
                required
            />

            <Textfield
                type="password"
                onChange={formHandler.handleChange}
                label="Confirm Password"
                placeholder="enter confirm password"
                name="confirm_password"
                value={formHandler.values.confirm_password}
                error={formHandler.errors.confirm_password}
                required
            />
            <div className="py-25"/>
            <Button
                loading={formHandler.isSubmitting}
                type="submit"
                label="Save Changes"
                onClick={() => {}}
            />
        </Card>
    );
};

export default ChangePasswordForm;