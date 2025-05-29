import { createEmployeeStatus } from "@/api/employee-status";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createStation, editStation } from "@/api/station";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditStationForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editStationFormHandler = useFormik({
        initialValues: {
            station_order: "",
            name: "",
            status: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            station_order: Yup.string().required("Station order is required."),
            name: Yup.string().required("Station name is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Station",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editStation(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Station updated successfully");
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
            editStationFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new employee status"
            onClose={() => {
                modal.onClose();
                editStationFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editStationFormHandler.handleSubmit}>
                <Textfield
                    label="Station name"
                    placeholder="enter station name"
                    name="name"
                    type="text"
                    value={editStationFormHandler.values.name}
                    required
                    onChange={editStationFormHandler.handleChange}
                    error={editStationFormHandler.errors.name}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editStationFormHandler.values.status}
                    required
                    onChange={editStationFormHandler.handleChange}
                    error={editStationFormHandler.errors.status}
                />
                <Dropdown
                    label="Station order"
                    placeholder="select station order"
                    name="station_order"
                    onChange={editStationFormHandler.handleChange}
                    value={editStationFormHandler.values.station_order}
                    error={editStationFormHandler.errors.station_order}
                    required
                    options={[
                        {
                            label: "1",
                            value: "1"
                        },
                        {
                            label: "2",
                            value: "2"
                        },
                        {
                            label: "3",
                            value: "3"
                        }
                    ]}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editStationFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editStationFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditStationForm;