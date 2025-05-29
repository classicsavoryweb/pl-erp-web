"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import StationDropDown from "../../generic/StationDropDown";
import { createPosition } from "@/api/positions";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import RankDropDown from "../../generic/RankDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreatePositionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createPositionFormHandler = useFormik({
        initialValues: {
            station_id: "",
            description: "",
            rank: "",
            status: "active"
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            station_id: Yup.string().required("Station is required."),
            description: Yup.string().required("Description is required."),
            rank: Yup.string().required("Rank is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Position",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createPosition(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Position created successfully");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new position"
            onClose={() => {
                modal.onClose();
                createPositionFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createPositionFormHandler.handleSubmit}>
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={createPositionFormHandler.values.description}
                    required
                    onChange={createPositionFormHandler.handleChange}
                    error={createPositionFormHandler.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createPositionFormHandler.values.status}
                    required
                    onChange={createPositionFormHandler.handleChange}
                    error={createPositionFormHandler.errors.status}
                />
                <RankDropDown
                    label="Rank"
                    placeholder="select rank"
                    name="rank"
                    value={createPositionFormHandler.values.rank}
                    required
                    onChange={createPositionFormHandler.handleChange}
                    error={createPositionFormHandler.errors.rank}
                />
                <StationDropDown
                    label="Station"
                    placeholder="select station"
                    name="station_id"
                    value={createPositionFormHandler.values.station_id}
                    required
                    onChange={createPositionFormHandler.handleChange}
                    error={createPositionFormHandler.errors.station_id}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createPositionFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createPositionFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreatePositionForm;