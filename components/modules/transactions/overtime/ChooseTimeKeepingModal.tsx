"use client";

import { forceAdjustOvertimeWithoutTimeKeeping } from "@/api/transactions/overtime";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    data: any[];
    overtimeData: any;
    onSubmitCallBack: () => void;
};

const ChooseTimeKeepingModal = ({
    modal,
    data = [],
    overtimeData = {},
    onSubmitCallBack
}: FormModalInterface) => {

    const columnSettings = [
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Actual Worked Hours",
            path: "worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.worked_hours * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Final Worked Hours",
            path: "final_worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.final_worked_hours * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Tardiness",
            path: "tardiness",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.tardiness == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.tardiness)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Undertime",
            path: "undertime",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.undertime == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.undertime)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Computed Overtime",
            path: "regular_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Hours",
            path: "night_diff_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Overtime",
            path: "night_diff_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Hours",
            path: "legal_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Overtime",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Hours",
            path: "special_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Overtime",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Approved Overtime",
            path: "approved_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Travel Time",
            path: "travel_time",
            columnType: COLUMNTYPES.timekeeping
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            timekeeping_id: "",
            overtime_id: overtimeData.id
        },
        validationSchema: Yup.object().shape({
            timekeeping_id: Yup.string().required("Timekeeping is required"), 
        }),
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Adjust Overtime",
                message: "Are you sure you want to adjust this overtime"
            });

            isConfirmed &&
            forceAdjustOvertimeWithoutTimeKeeping(values)
            .then((resp) => {
                setSubmitting(true);
                if (!resp.error) {
                    onSubmitCallBack();
                    toast.success("Overtime adjusted successfully");
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            formHandler.setFieldValue("overtime_id", overtimeData.id);
        }
    }, [modal.isShowing])

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Timekeeping"
            onClose={() => {
                modal.onClose();
            }}
            size="xxl"
        >
            <p>Timekeeping with Computed Overtime</p>
            <Table
                columnSettings={columnSettings}
                dataSet={data}
                smallText
            />

            <form className="mt-5" onSubmit={formHandler.handleSubmit}>
                <Grid cols={3}>  
                    <Dropdown
                        label="Timekeeping Date"
                        name="timekeeping_id"
                        placeholder="select time keeping"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.timekeeping_id}
                        error={formHandler.errors.timekeeping_id}
                        options={data.map((tk) => {
                            return {
                                label:  moment(tk.date).format("MMMM DD, YYYY"),
                                value: tk.id
                            }
                        })}
                        required
                    />

                    <Textfield
                        label="Overtime Date"
                        disabled
                        value={moment(overtimeData.overtime_date).format("MMMM DD, YYYY")}
                    />

                    <Textfield
                        label="Applied Hours"
                        disabled
                        value={overtimeData.total_hours}
                    />
                </Grid>
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex gap-x-2 justify-end">
                    <div>
                        <Button
                            loading={formHandler.isSubmitting}
                            label="Submit"
                            type="submit"
                            onClick={() => {}}
                        />            
                    </div>
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                            }}
                        />            
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ChooseTimeKeepingModal;