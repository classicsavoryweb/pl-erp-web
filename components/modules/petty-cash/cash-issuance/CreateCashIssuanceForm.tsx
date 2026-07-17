"use client";

import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { useEffect, useState } from "react";
import moment from "moment";
import { getPCVNumber, getBranchEmployees, getBranchApprovers, createCashIssuance } from "@/api/petty-cash/cash-issuance";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    onRefreshCustodian: () => void;
    custodianBranches: any[];
}

const CreateCashIssuanceForm = ({ modal, onSubmitCallback, onRefreshCustodian, custodianBranches }: FormModalInterface) => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [approvers, setApprovers] = useState<any[]>([]);
    const [approversLoading, setApproversLoading] = useState(false);

    const formHandler = useFormik({
        initialValues: {
            pcv_number: "",
            date: moment().format("YYYY-MM-DD"),
            branch_id: "",
            requested_by_employee_number: "",
            received_by_employee_number: "",
            approved_by_employee_number: "",
            amount: "",
            detailed_purpose: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.string().required("Branch is required."),
            requested_by_employee_number: Yup.string().required("Requested by is required."),
            received_by_employee_number: Yup.string().required("Received by is required."),
            approved_by_employee_number: Yup.string().required("Approved by is required."),
            amount: Yup.number()
                .typeError("Amount must be a number.")
                .required("Amount is required.")
                .min(0.01, "Amount must be greater than 0."),
            detailed_purpose: Yup.string().required("Detailed purpose is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Cash Issuance",
                message: "Are you sure you want to create this cash issuance?",
            });

            if (isConfirmed) {
                setSubmitting(true);
                createCashIssuance({
                    branch_id: values.branch_id,
                    requested_by_employee_number: values.requested_by_employee_number,
                    received_by_employee_number: values.received_by_employee_number,
                    approved_by_employee_number: values.approved_by_employee_number,
                    amount: values.amount,
                    detailed_purpose: values.detailed_purpose,
                })
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Cash issuance created successfully");
                            onSubmitCallback();
                            onRefreshCustodian();
                            modal.onClose();
                            resetForm();
                            setEmployees([]);
                            setApprovers([]);
                        } else {
                            toast.error(resp.data?.message || "Error creating cash issuance");
                        }
                    })
                    .catch(() => toast.error("Error encountered"))
                    .finally(() => setSubmitting(false));
            }
        },
    });

    // Refetch eligible approvers whenever branch or amount changes
    useEffect(() => {
        const branchId = formHandler.values.branch_id;
        const amount = Number(formHandler.values.amount);

        formHandler.setFieldValue("approved_by_employee_number", "");
        setApprovers([]);

        if (!branchId || !amount || amount <= 0) return;

        const timer = setTimeout(() => {
            setApproversLoading(true);
            getBranchApprovers({ branch_id: branchId, amount })
                .then((resp) => {
                    if (!resp.error) setApprovers(resp.data?.approvers ?? []);
                })
                .catch(() => {})
                .finally(() => setApproversLoading(false));
        }, 600);

        return () => clearTimeout(timer);
    }, [formHandler.values.branch_id, formHandler.values.amount]);

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const branchId = e.target.value;
        formHandler.setFieldValue("branch_id", branchId);
        formHandler.setFieldValue("requested_by_employee_number", "");
        formHandler.setFieldValue("received_by_employee_number", "");
        formHandler.setFieldValue("approved_by_employee_number", "");
        formHandler.setFieldValue("pcv_number", "");
        setEmployees([]);
        setApprovers([]);

        if (!branchId) return;

        setEmployeesLoading(true);
        Promise.all([
            getPCVNumber({ branch_id: branchId }),
            getBranchEmployees({ branch_id: branchId }),
        ])
            .then(([pcvResp, empResp]) => {
                if (!pcvResp.error) {
                    formHandler.setFieldValue("pcv_number", pcvResp.data?.pcv_number ?? "");
                } else {
                    toast.error(pcvResp.data?.message || "Error loading PCV number");
                }
                if (!empResp.error) {
                    setEmployees(empResp.data?.employees ?? []);
                } else {
                    toast.error(empResp.data?.message || "Error loading employees");
                }
            })
            .catch(() => toast.error("Error loading branch data"))
            .finally(() => setEmployeesLoading(false));
    };

    const handleClose = () => {
        modal.onClose();
        formHandler.resetForm();
        setEmployees([]);
        setApprovers([]);
    };

    const handleRequestedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        formHandler.setFieldValue("requested_by_employee_number", value);
        formHandler.setFieldValue("received_by_employee_number", value);
    };

    const approverOptions = approvers.map((e: any) => ({
        label: `${e.last_name}, ${e.first_name}${e.middle_name ? " " + e.middle_name : ""}`,
        value: e.employee_number,
    }));

    const employeeOptions = employees.map((e: any) => ({
        label: `${e.last_name}, ${e.first_name}${e.middle_name ? " " + e.middle_name : ""}`,
        value: e.employee_number,
    }));

    const branchOptions = custodianBranches.map((b: any) => ({
        label: b.name,
        value: b.id,
    }));

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Cash Issuance"
            onClose={handleClose}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <div className="grid grid-cols-2 gap-x-4">
                    <Textfield
                        label="PCV Number"
                        name="pcv_number"
                        value={formHandler.values.pcv_number}
                        disabled
                        onChange={() => {}}
                    />
                    <Textfield
                        label="Date"
                        name="date"
                        value={formHandler.values.date}
                        disabled
                        onChange={() => {}}
                    />
                </div>

                <Dropdown
                    label="Branch"
                    placeholder="select branch"
                    name="branch_id"
                    value={String(formHandler.values.branch_id)}
                    onChange={handleBranchChange}
                    required
                    error={formHandler.errors.branch_id}
                    options={branchOptions}
                />

                <Dropdown
                    label="Requested By"
                    placeholder={employeesLoading ? "loading..." : "select employee"}
                    name="requested_by_employee_number"
                    value={formHandler.values.requested_by_employee_number}
                    onChange={handleRequestedByChange}
                    required
                    disabled={!formHandler.values.branch_id || employeesLoading}
                    error={formHandler.errors.requested_by_employee_number}
                    options={employeeOptions}
                />

                <Dropdown
                    label="Received By"
                    placeholder={employeesLoading ? "loading..." : "select employee"}
                    name="received_by_employee_number"
                    value={formHandler.values.received_by_employee_number}
                    onChange={formHandler.handleChange}
                    required
                    disabled={!formHandler.values.branch_id || employeesLoading}
                    error={formHandler.errors.received_by_employee_number}
                    options={employeeOptions}
                />

                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="number"
                    value={formHandler.values.amount}
                    onChange={formHandler.handleChange}
                    required
                    error={formHandler.errors.amount}
                />

                <Dropdown
                    label="Approved By"
                    placeholder={
                        !formHandler.values.branch_id || !Number(formHandler.values.amount)
                            ? "select branch and amount first"
                            : approversLoading
                            ? "loading..."
                            : approvers.length === 0
                            ? "no eligible approvers"
                            : "select approver"
                    }
                    name="approved_by_employee_number"
                    value={formHandler.values.approved_by_employee_number}
                    onChange={formHandler.handleChange}
                    required
                    disabled={!formHandler.values.branch_id || !Number(formHandler.values.amount) || approversLoading}
                    error={formHandler.errors.approved_by_employee_number}
                    options={approverOptions}
                />

                <Textfield
                    label="Detailed Purpose"
                    placeholder="enter detailed purpose"
                    name="detailed_purpose"
                    value={formHandler.values.detailed_purpose}
                    onChange={formHandler.handleChange}
                    required
                    error={formHandler.errors.detailed_purpose}
                />

                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end gap-x-2">
                    <Button label="Cancel" variant="secondary" onClick={handleClose} />
                    <Button
                        type="submit"
                        label="Submit"
                        loading={formHandler.isSubmitting}
                        onClick={() => {}}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CreateCashIssuanceForm;
