"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";
import { useEffect } from "react";
import { useAsyncEffect } from "@/hooks/async-effect";
import confirm from "@/components/common/Confirm";
import { getPositions } from "@/api/positions";
import { editIncentivesBracket, getIncentivesBracket } from "@/api/maintenance/incentives-bracket";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditIncentivesBracketForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const fixedIncrements = [
        { value: 1, label: "1st Month" },
        { value: 2, label: "2nd Month" },
        { value: 3, label: "3rd Month" },
        { value: 4, label: "4th Month" },
        { value: 5, label: "5th Month" },
        { value: 6, label: "6th Month" },
        { value: 7, label: "7th Month" },
        { value: 8, label: "8th Month" },
        { value: 9, label: "9th Month" },
        { value: 10, label: "10th Month" },
        { value: 11, label: "11th Month" },
        { value: 12, label: "12th Month" },
        { value: 24, label: "24th Month" },
    ];

    const editFormHandler = useFormik<{
        incentives_bracket_id: string,
        bracket_name: string,
        increments: { month: string; amount: string }[],
        position_id: number[],
    }>({
        enableReinitialize: true,
        initialValues: {
            incentives_bracket_id: formValue.incentives_bracket_id || "",
            bracket_name: formValue.bracket_name || "",
            position_id: formValue.position_id || [],
            increments: fixedIncrements.map((increment) => {
                const match = formValue.increments?.find((data: any) => String(data.month) === String(increment.value));
                return {
                    month: String(increment.value),
                    amount: match?.amount || "",
                };
            }),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            bracket_name: Yup.string().required("Bracket name is required."),
            increments: Yup.array().of(
                Yup.object().shape({
                    month: Yup.string().required(),
                    amount: Yup.string().required("Amount is required."),
                })
            ).min(1, "At least one increment is required."),
            position_id: Yup.array().min(1, "Position is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Edit incentives bracket",
                message: "Are you sure you want to save changes?",
            });

            if (isConfirmed) {
                setSubmitting(true);
                editIncentivesBracket({
                    incentives_bracket_id: formValue.incentives_bracket_id,
                    bracket_name: values.bracket_name,
                    position_id: values.position_id,
                    increments: values.increments,
                }, formValue.bracket_id).then((resp) => {
                    if (!resp.error) {
                        toast.success("Incentives bracket updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                })
                .catch(() => {
                    toast.error("Error encountered");
                })
                .finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
        api.setLoading(true);
        getPositions()
            .then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.positions);
                }
            })
            .finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const id = Number(e.target.value);
        if (e.target.checked) {
            editFormHandler.setFieldValue("position_id", [
                ...editFormHandler.values.position_id,
                id
            ]);
        } else {
            const ids = editFormHandler.values.position_id;
            const newIds = ids.filter((item) => item !== id);
            editFormHandler.setFieldValue("position_id", newIds);
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Incentives Bracket"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Bracket name"
                    placeholder="enter bracket name"
                    name="bracket_name"
                    type="text"
                    value={editFormHandler.values.bracket_name}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.bracket_name}
                />

                <div className="py-3">
                    <div className="flex justify-between items-center">
                        <p>Positions<span className="text-red-400">*</span></p>
                        <Checkbox
                            label="Select All"
                            value={api.dataSet}
                            checked={editFormHandler.values.position_id.length === api.dataSet.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                const ids = api.dataSet.map((data) => data.id);
                                editFormHandler.setFieldValue("position_id", ids);
                                } else {
                                editFormHandler.setFieldValue("position_id", []);
                                }
                            }}
                        />
                    </div>
                    <div className="max-h-[350px] overflow-hidden overflow-y-auto p-3">
                        <Grid cols={2}>
                            {api.dataSet.map((data, key) => (
                                <Checkbox
                                    label={data.description}
                                    key={key}
                                    value={data.id}
                                    checked={editFormHandler.values.position_id.includes(data.id)}
                                    onChange={(e) => handleCheckboxChange(e, data.id)}
                                />
                            ))}
                        </Grid>
                    </div>
                </div>
                
                <p>Incentive Increments<span className="text-red-400">*</span></p>
                <div className="max-h-[350px] overflow-hidden overflow-y-auto p-3">
                    <Grid cols={2}>
                        {editFormHandler.values.increments.map((increment, index) => {
                            const label = fixedIncrements.find((item) => String(item.value) === increment.month)?.label || `Month ${increment.month}`;
                            
                            return (
                                <Textfield
                                key={index}
                                label={label}
                                placeholder="Enter amount"
                                name={`increments[${index}].amount`}
                                type="text"
                                value={increment.amount}
                                onChange={editFormHandler.handleChange}
                                error={
                                    editFormHandler.errors.increments &&
                                    (editFormHandler.errors.increments[index] as any)?.amount
                                }
                                />
                            );
                        })}
                    </Grid>
                </div>

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditIncentivesBracketForm;