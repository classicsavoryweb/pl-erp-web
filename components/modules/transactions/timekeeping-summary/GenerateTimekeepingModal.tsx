import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import Textfield from "@/components/common/Textfield";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useBranchStore } from "@/stores/useBranchStore";
import { useState } from "react";
import { useApiCall } from "@/hooks/api-call";
import { generateTimeKeepingSummary, getEmployeesPerTimekeepingBranch } from "@/api/transactions/time-keeping";
import Dropdown from "@/components/common/Dropdown";
import { useModal } from "@/hooks/modal";
import GenerateEmployeeTableModal from "./GenerateEmployeeTableModal";

interface FormModalInterface {
    modal: any;
};

const GenerateTimeKeepingModal = ({
    modal,
}: FormModalInterface) => {

    const [filteredBranches, setFilteredBranches] = useState<any[]>([]);
    const {branches, loading, getBranches} = useBranchStore();
    const perEmployeeModal = useModal();
    const [dataSet, setDataSet] = useState<any[]>([]);
    const api = useApiCall();

    useAsyncEffect(() => {    
        if (modal.isShowing) {
            getBranches();
            if (branches.length > 0) {
                api.setDataSet(branches);
                setFilteredBranches(branches);
            }
        }    
    }, [modal.isShowing]);

    const getIdsByBranchType = (typeLabel: string) =>
        api.dataSet
            .filter((branch: any) => String(branch.type).toLowerCase() === typeLabel.toLowerCase())
            .map((branch: any) => branch.id);

    const areAllTypeSelected = (typeLabel: string) => {
        const ids = getIdsByBranchType(typeLabel);
        return ids.length > 0 && ids.every((id: number) => formHandler.values.branch_id.includes(id));
    };

    const handleTypeToggle = (typeLabel: string, checked: boolean) => {
        const ids = getIdsByBranchType(typeLabel);
        const current = formHandler.values.branch_id;
        if (checked) {
            const merged = Array.from(new Set([...current, ...ids]));
            formHandler.setFieldValue("branch_id", merged);
        } else {
            const removed = current.filter((id) => !ids.includes(id));
            formHandler.setFieldValue("branch_id", removed);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const current = [...formHandler.values.branch_id];
        if (e.target.checked) {
            if (!current.includes(value)) {
                current.push(value);
            }
        } else {
            const index = current.indexOf(value);
            if (index !== -1) {
                current.splice(index, 1);
            }
        }
        formHandler.setFieldValue("branch_id", current);
    };

    const formHandler = useFormik<{
        key_word: string,
        branch_id: number[],
        type: string,
    }>({
        initialValues: {
            key_word: "",
            type: "DIRECT",
            branch_id: []
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            branch_id: Yup.array().required("Branch is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            if (values.branch_id.length == 0) {
                toast.error("Please select atleast 1 branch");
                return;
            }

            if (values.type == "DIRECT") {
                const resp = await getEmployeesPerTimekeepingBranch({
                    branch_id: values.branch_id
                });

                if (!resp.error) {
                    resetForm();
                    setDataSet(resp.data);
                    perEmployeeModal.onOpen();
                } else {
                    toast.error(resp.data.message);
                }
            }

            if (values.type == "BACKGROUND") {
                const isConfirm = await confirm({
                    title: "Timekeeping",
                    message: "Are you sure you want generate timekeeping?"
                });
    
                if (isConfirm) {
                    try {
                        const resp = await generateTimeKeepingSummary(values);
        
                        if (!resp.error) {
                            resetForm();
                            modal.onClose();
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
            }
        }
    });

    return (
        <>
        <Modal
            isShowing={modal.isShowing}
            title="Generate Timekeeping"
            onClose={() => {
                modal.onClose();
            }}
            size="lg"
            loading={loading}
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Dropdown
                    required
                    label="Type"
                    placeholder="select type"
                    name="type"
                    value={formHandler.values.type}
                    onChange={formHandler.handleChange}
                    options={[
                        {
                            label: "Direct",
                            value: "DIRECT",
                        },
                        {
                            label: "Background",
                            value: "BACKGROUND"
                        }
                    ]}
                />
                <div className="flex justify-between items-center">
                    <p>Branches</p>
                    <div className="flex gap-2">
                        <Checkbox
                            label={"Branch"}
                            value="branch"
                            checked={areAllTypeSelected("Branch")}
                            onChange={(e) => handleTypeToggle("Branch", e.target.checked)}
                        />
                        <Checkbox
                            label={"Head Office"}
                            value="head_office"
                            checked={areAllTypeSelected("Head Office")}
                            onChange={(e) => handleTypeToggle("Head Office", e.target.checked)}
                        />
                        <Checkbox
                            label={"Select All"}
                            value="select_all"
                            checked={api.dataSet.length > 0 && formHandler.values.branch_id.length === api.dataSet.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    const allBranchIds = api.dataSet.map((data) => data.id);
                                    formHandler.setFieldValue("branch_id", allBranchIds);
                                } else {
                                    formHandler.setFieldValue("branch_id", []);
                                }
                            }}
                        />
                    </div>
                </div>
                <Textfield
                    name="key_word"
                    label=""
                    placeholder="search for branch"
                    value={formHandler.values.key_word}
                    onChange={(e) => {
                        formHandler.setFieldValue("key_word", e.target.value);
                        const keyword = e.target.value.trim().toLowerCase();
                        if (keyword) {
                            const filtered = api.dataSet.filter((branch) =>
                                String(branch.name).toLowerCase().includes(keyword)
                            );
                            setFilteredBranches(filtered);
                        } else {
                            setFilteredBranches(api.dataSet);
                        }
                    }}
                />
                <div className="max-h-[350px] overflow-hidden overflow-y-auto p-3">
                    <Grid cols={2}>
                        {filteredBranches.map((data, key) => (
                            <Checkbox
                                label={data.name}
                                key={key}
                                value={data.id}
                                checked={formHandler.values.branch_id.includes(data.id)}
                                onChange={(e) => handleCheckboxChange(e, data.id)}
                            />
                        ))}
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

        <GenerateEmployeeTableModal
            modal={perEmployeeModal}
            dataSet={dataSet}
        />
        </>
    );
};

export default GenerateTimeKeepingModal;