import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import BranchDropDown from "../../generic/BranchDropDown";
import { getScheduleTimeEmployees, transferTimeKeepingBranchAll } from "@/api/transactions/schedule-time";
import Textfield from "@/components/common/Textfield";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useEffect, useState } from "react";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";
import moment from "moment";

interface FormModalInterface {
    modal: any;
    filterValues: any;
    currentBranch: any;
    onSubmitCallback: () => void;
};

const TransferTimeKeepingBranchAllModal = ({
    modal,
    filterValues,
    currentBranch,
    onSubmitCallback
}: FormModalInterface) => {

    const [employeeRows, setEmployeeRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [resetSelection, setResetSelection] = useState(false);

    const columnSettings = [
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Timekeeping Branch",
            path: "branch.short_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Current Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string
        },
    ];

    const formHandler = useFormik({
        initialValues: {
            source_branch_id: "",
            destination_branch_id: "",
            cutoff: filterValues?.cutoff ?? getCurrentCutoff(),
            selected_cutoff: filterValues?.cutoff?.range ?? getCurrentCutoff().range,
            year: filterValues?.year ?? moment().year(),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            source_branch_id: Yup.string().required("Branch is required"),
            destination_branch_id: Yup.string().required("Transfer branch is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            if (!selectedRows.length) {
                toast.error("Please select at least one employee.");
                setSubmitting(false);
                return;
            }
            if (values.source_branch_id === values.destination_branch_id) {
                toast.error("Transfer To branch must be different from the Timekeeping Branch.");
                setSubmitting(false);
                return;
            }

            const isConfirm = await confirm({
                title: "Transfer Branch (All)",
                message: "Are you sure you want to transfer all schedules in the current filters?"
            });

            if (!isConfirm) {
                setSubmitting(false);
                return;
            }

            try {
                const resp = await transferTimeKeepingBranchAll({
                    source_branch_id: values.source_branch_id,
                    new_branch_id: values.destination_branch_id,
                    cutoff: values.cutoff,
                    year: values.year,
                    column_type: filterValues.column_type,
                    key_word: filterValues.key_word,
                    employee_ids: selectedRows
                });

                if (!resp.error) {
                    resetForm();
                    modal.onClose();
                    onSubmitCallback();
                    toast.success(resp.data.message);
                } else {
                    toast.error(resp.data.message);
                }
            } catch (error) {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!modal.isShowing) return;
            if (!formHandler.values.source_branch_id) {
                setEmployeeRows([]);
                setSelectedRows([]);
                return;
            }

            setLoading(true);
            try {
                const resp = await getScheduleTimeEmployees({
                    branch_id: formHandler.values.source_branch_id,
                    cutoff: formHandler.values.cutoff,
                    year: formHandler.values.year,
                    column_type: filterValues.column_type,
                    key_word: filterValues.key_word
                });

                if (!resp.error) {
                    const rows = resp.data ?? [];
                    const selected = rows
                        .map((row: any) => row?.employee?.id)
                        .filter(Boolean);
                    setEmployeeRows(rows);
                    setSelectedRows(selected);
                    setResetSelection(prev => !prev);
                } else {
                    toast.error(resp.data.message);
                }
            } catch (error) {
                toast.error("Error encountered");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [
        modal.isShowing,
        formHandler.values.source_branch_id,
        formHandler.values.cutoff?.start_time,
        formHandler.values.cutoff?.end_time,
        formHandler.values.year,
        filterValues?.column_type,
        filterValues?.key_word
    ]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Transfer Branch (All)"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <BranchDropDown
                    label="Select Timekeeping Branch"
                    placeholder="select branch"
                    name="source_branch_id"
                    required
                    onChange={formHandler.handleChange}
                    value={formHandler.values.source_branch_id}
                    error={formHandler.errors.source_branch_id}
                />
                <CutOffDropDown
                    value={formHandler.values.selected_cutoff}
                    onChange={(e) => {
                        formHandler.setFieldValue("selected_cutoff", e.target.value);
                        formHandler.setFieldValue("cutoff", e.target.obj || null);
                    }}
                />

                <div className="mt-4">
                    <Table
                        dataSet={employeeRows}
                        columnSettings={columnSettings}
                        loading={loading}
                        withCheckBox
                        dataKey="employee.id"
                        onCheck={(rows: any) => {
                            setSelectedRows(rows);
                        }}
                        initialSelectedRows={selectedRows}
                        resetRows={resetSelection}
                        smallText
                    />
                </div>
                <BranchDropDown
                    label="Transfer To"
                    placeholder="select branch"
                    name="destination_branch_id"
                    required
                    onChange={formHandler.handleChange}
                    value={formHandler.values.destination_branch_id}
                    error={formHandler.errors.destination_branch_id}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default TransferTimeKeepingBranchAllModal;
