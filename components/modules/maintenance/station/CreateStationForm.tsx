import { createEmployeeStatus } from "@/api/employee-status";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createStation } from "@/api/station";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateStationForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createStationFormHandler = useFormik({
        initialValues: {
            station_order: "",
            name: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            station_order: Yup.string().required("Station order is required."),
            name: Yup.string().required("Station name is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Station",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createStation(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Station created successfully");
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
            title="Create new employee status"
            onClose={() => {
                modal.onClose();
                createStationFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createStationFormHandler.handleSubmit}>
                <Textfield
                    label="Station name"
                    placeholder="enter station name"
                    name="name"
                    type="text"
                    value={createStationFormHandler.values.name}
                    required
                    onChange={createStationFormHandler.handleChange}
                    error={createStationFormHandler.errors.name}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createStationFormHandler.values.status}
                    required
                    onChange={createStationFormHandler.handleChange}
                    error={createStationFormHandler.errors.status}
                />
                <Dropdown
                    label="Station order"
                    placeholder="select station order"
                    name="station_order"
                    onChange={createStationFormHandler.handleChange}
                    value={createStationFormHandler.values.station_order}
                    error={createStationFormHandler.errors.station_order}
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
                                createStationFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createStationFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateStationForm;