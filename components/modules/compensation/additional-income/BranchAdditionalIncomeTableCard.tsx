"use client";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllBranchAdditionalIncome } from "@/api/compensation/branch-additional-income";
import CreateBranchAdditionalIncomeForm from "./CreateBranchAdditionalIncomeForm";
import ImportBranchAdditionalIncomeModal from "./ImportBranchAdditionalIncomeModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@/components/common/Grid";
import Button from "@/components/common/Button";
import CutOffDropDown from "../../generic/CutOffDropDown";
import moment from "moment";
import { getCurrentCutoff } from "@/helper/cutoff";
import Dropdown from "@/components/common/Dropdown";
import BranchDropDown from "../../generic/BranchDropDown";

const BranchAdditionalIncomeTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const createModal = useModal();
    const importModal = useModal();
    const currentCutoff = getCurrentCutoff();

    const formHandler = useFormik({
        initialValues: {
            cutoff_start: currentCutoff.start_time,
            cutoff_end: currentCutoff.end_time,
            selected_cutoff: currentCutoff.range,
            year: moment().year(),
            branch_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            cutoff_start: Yup.string().required(),
            cutoff_end: Yup.string().required(),
            year: Yup.number().required()
        }),
        onSubmit: async () => {
            paginator.setPage(1);
            api.triggerReload();
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllBranchAdditionalIncome({
            page: paginator.page,
            per_page: paginator.per_page,
            cutoff_start: formHandler.values.cutoff_start,
            cutoff_end: formHandler.values.cutoff_end,
            year: formHandler.values.year,
            branch_id: formHandler.values.branch_id
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching additional income");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            api.setLoading(false);
        });
    }, [
        paginator.reload,
        api.reload,
        formHandler.values.cutoff_start,
        formHandler.values.cutoff_end,
        formHandler.values.year,
        formHandler.values.branch_id
    ]);

    const columnSettings = [
        {
            columnHead: "Branch",
            path: "branch.name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Payment Date",
            path: "pay_date",
            columnType: COLUMNTYPES.date
        },
    ];

    const actionsSettings = [
        {
            label: "Create Additional Income",
            onClick: () => {
                createModal.onOpen();
            }
        },
        {
            label: "Import Additional Income",
            onClick: () => {
                importModal.onOpen();
            }
        }
];

    return (
        <>
            <Card>
                <p className=" font-semibold text-red-800 dark:text-red-500">Filters</p>
                <form onSubmit={formHandler.handleSubmit}>
                    <Grid cols={4}>
                        <CutOffDropDown
                            value={formHandler.values.selected_cutoff}
                            onChange={(e) => {
                                formHandler.setFieldValue("selected_cutoff", e.target.value);
                                formHandler.setFieldValue("cutoff_start", e.target.obj?.start_time || "");
                                formHandler.setFieldValue("cutoff_end", e.target.obj?.end_time || "");
                            }}
                        />
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return { label: year.toString(), value: year.toString() };
                            })}
                        />
                        <BranchDropDown
                            placeholder="select branch"
                            label="Branch"
                            name="branch_id"
                            value={formHandler.values.branch_id}
                            onChange={formHandler.handleChange}
                        />
                    </Grid>
                    <div className="flex justify-end gap-x-2">
                        <div className="w-[100px]">
                            <Button
                                type="submit"
                                label="Search"
                                onClick={() => {}}
                            />
                        </div>
                        <div className="w-[100px]">
                            <Button
                                label="Reset"
                                type="button"
                                onClick={() => {
                                    formHandler.resetForm();
                                    formHandler.submitForm();
                                }}
                                variant="secondary"
                            />
                        </div>
                    </div>
                </form>
            </Card>
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actionsSettings}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
            <CreateBranchAdditionalIncomeForm
                modal={createModal}
                cutoffStart={formHandler.values.cutoff_start}
                cutoffEnd={formHandler.values.cutoff_end}
                year={formHandler.values.year}
                onSubmitCallback={() => {
                    api.triggerReload();
                    createModal.onClose();
                }}
            />
            <ImportBranchAdditionalIncomeModal
                modal={importModal}
                cutoffStart={formHandler.values.cutoff_start}
                cutoffEnd={formHandler.values.cutoff_end}
                year={formHandler.values.year}
                onSubmitCallback={() => {
                    api.triggerReload();
                    importModal.onClose();
                }}
            />
        </>
    );
};

export default BranchAdditionalIncomeTableCard;
