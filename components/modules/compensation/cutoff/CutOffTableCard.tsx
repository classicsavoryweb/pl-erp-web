"use client";
import { getAllCutOffs } from "@/api/compensation/cut-off";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import CreateCutOffModal from "./CreateCutOffModal";
import moment from "moment";
import ActionDropDown from "@/components/common/ActionDropDown";
import { useState } from "react";
import EditCutOffModal from "./EditCutOffModal";
import ViewCutOffModal from "./ViewCutOffModal";

const CutOffTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const createCutOffModal = useModal();
    const viewCutOffModal = useModal();
    const editCutOffModal = useModal();
    const [data, setData] = useState<any>({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllCutOffs({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching cutoffs");
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
    }, [paginator.reload, api.reload]);

    const columnSettings = [
        {
            columnHead: "Cutoff",
            path: "cut_off",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                return moment(data.start_date).format("MMM D")+" - "+moment(data.end_date).format("MMM D") +", "+moment(data.end_date).format("YYYY");
            }
        },
        {
            columnHead: "Payment Date",
            path: "pay_date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status
        },
        {
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let actionSettings = tableActions;
                if (data.status === "inactive") {
                    actionSettings = [
                        tableActions[0]
                    ];
                }

                return (
                    <ActionDropDown
                        data={data}
                        actions={actionSettings}
                    />
                );
            }
        },
    ];

    const actionsSettings = [
        {
            label: "Setup Cutoff",
            onClick: () => {
                createCutOffModal.onOpen();
            }
        }
    ];

    const tableActions = [
        {
            label: "View",
            onClick: (data: any) => {
                viewCutOffModal.onOpen();
                setData(data);
                console.log(data);
            }   
        },
        {
            label: "Edit",
            onClick: (data: any) => {
                editCutOffModal.onOpen();
                setData(data);
            }   
        }
    ];
    
    return (
        <>
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
            <CreateCutOffModal
                modal={createCutOffModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditCutOffModal
                modal={editCutOffModal}
                onSubmitCallback={api.triggerReload}
                data={data}
            />
            <ViewCutOffModal
                modal={viewCutOffModal}
                data={data}
            />
        </>
    );
};

export default CutOffTableCard;