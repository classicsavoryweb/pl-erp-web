"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import StationDropDown from "../../generic/StationDropDown";
import { createPosition, editPosition } from "@/api/positions";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import RankDropDown from "../../generic/RankDropDown";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditPositionForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editPositionFormHandler = useFormik({
        initialValues: {
            station_id: "",
            description: "",
            rank: "",
            status: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            station_id: Yup.string().required("Station is required."),
            description: Yup.string().required("Description is required."),
            rank: Yup.string().required("Rank is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit:async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Position",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPosition(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Position updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            editPositionFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Update position"
            onClose={() => {
                modal.onClose();
                editPositionFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editPositionFormHandler.handleSubmit}>
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={editPositionFormHandler.values.description}
                    required
                    onChange={editPositionFormHandler.handleChange}
                    error={editPositionFormHandler.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editPositionFormHandler.values.status}
                    required
                    onChange={editPositionFormHandler.handleChange}
                    error={editPositionFormHandler.errors.status}
                />
                <RankDropDown
                    label="Rank"
                    placeholder="select rank"
                    name="rank"
                    value={editPositionFormHandler.values.rank}
                    required
                    onChange={editPositionFormHandler.handleChange}
                    error={editPositionFormHandler.errors.rank}
                />
                <StationDropDown
                    label="Station"
                    placeholder="select station"
                    name="station_id"
                    value={editPositionFormHandler.values.station_id}
                    required
                    onChange={editPositionFormHandler.handleChange}
                    error={editPositionFormHandler.errors.station_id}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editPositionFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editPositionFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditPositionForm;