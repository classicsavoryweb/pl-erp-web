
"use client";


import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import { getWeightedAverage , exportAllWeightAverage , exportWeightAverageDetails, updateWeightStatus} from "@/api/uniform/weighted-average";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import Badge from "@/components/common/Badge";
import DropDownButtons from "@/components/common/DropDownButtons";
import  WeightedAverageForm  from "./WeightAverageForm";
import ActionDropDown from "@/components/common/ActionDropDown";
import confirm from "@/components/common/Confirm";

const WeightedAverageTable = () => {
    const api = useApiCall();
    const createModal = useModal();
    const viewModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

     useAsyncEffect(() => {
        api.setLoading(true);
        getWeightedAverage({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error Weighted Average Data");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);                       
            }                    
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [paginator.reload, api.reload, filter.reload]);

    const tableActions = (item: any) => [
            {
                label: "View",
                onClick: () => {
                    setData(item);
                    viewModal.onOpen();
                },
            },
            {
                label: "Detailed Export",
                onClick: () => downloadDetailedExport(item),
            },
            item.status === "Unposted" && {
                label: "Reviewed",
                onClick: async () => {
                    const isConfirmed = await confirm({
                        title: "Review Weighted Average",
                        message: "Are you sure you want to mark this as Reviewed?",
                    });
    
                    if (!isConfirmed) return;
    
                    await updateWeightStatus(item.id, "Reviewed");
                    toast.success("Marked as Reviewed");
                    api.triggerReload();
                },
            },
            ["Reviewed", "Reviewing"].includes(item.status) && {
                label: "Posted",
                onClick: async () => {
                    const isConfirmed = await confirm({
                        title: "Post Weighted Average",
                        message: "Are you sure you want to mark this as Posted?",
                    });

                    if (!isConfirmed) return;
    
                    await updateWeightStatus(item.id, "Posted");
                    toast.success("Marked As Posted");
                    api.triggerReload();
                },
            },
            ["Unposted", "Reviewed", "Reviewing"].includes(item.status) && {
                label: "Cancel",
                onClick: async () => {
                    const isConfirmed = await confirm({
                        title: "Cancel Weighted Average",
                        message: "Are you sure you want to cancel this weighted average?",
                    });

                    if (!isConfirmed) return;

                    await updateWeightStatus(item.id, "Cancelled");
                    toast.success("Weighted average cancelled");
                    api.triggerReload();
                },
            },
        ].filter((action): action is { label: string; onClick: () => void } => Boolean(action));

    const downloadDetailedExport = async (item: any) => {
        const resp = await exportWeightAverageDetails(item.id);
        const payload = resp?.data ?? resp;
        const isBlob = payload instanceof Blob;
        const isArrayBuffer = payload && payload.byteLength !== undefined;

        if (!resp || resp.error || (!isBlob && !isArrayBuffer)) {
            toast.error(resp?.data?.message || resp?.message || "Export failed. Please try again.");
            return;
        }

        const blob = isBlob ? payload : new Blob([payload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = `WEIGHTED-AVERAGE-DETAILED-${item.weighted_id}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const columnSettings = [
        { columnHead: "WA Number", path: "weighted_id", columnType: COLUMNTYPES.string },
        { columnHead: "Posting Date", path: "prepared_at", columnType: COLUMNTYPES.date },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.function, function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Posted": 
                        status = "success";
                        break;
                    case "Cancelled":
                        status = "danger";
                        break;
                    case "Reviewed":
                    case "Reviewing":
                        status = "warning";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.status}
                    status={status}
                    
                />
         }},
        { columnHead: "Posted By", path: "posted_by", columnType: COLUMNTYPES.string },
        { columnHead: "Remarks", path: "overall_remarks", columnType: COLUMNTYPES.string },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (item: any) => (
                <ActionDropDown
                    data={item}
                    actions={tableActions(item)}
                />
            ),
        },
          
    ];   

    const actionSettings = [
        {
            label: "Generate Weighted Average",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];

    // const tableActions = [
    //     {
    //         label: "View",
    //         onClick:(item: any) =>{
    //             setData(item);
    //             viewModal.onOpen();
    //         }
    //     }
    // ];
    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Posting Date",
                        path: "prepared_at",
                        columnType: COLUMNTYPES.date
                    },
                    {
                        columnHead: "Status",
                        path: "status",
                        columnType: COLUMNTYPES.status
                    },
                    
                ]}
                filterHandler={filter}
                exportFileName={`WeightAverage-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="status"
                hasExport
                api={exportAllWeightAverage}
                callBack={() => {
                paginator.setPage(1);
                }}
            />
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    
                />
                
                
                <WeightedAverageForm 
                modal = {viewModal}
                mode = "view"
                formValue={data}
                onSubmitCallback= {api.triggerReload}
                />
                <WeightedAverageForm 
                modal = {createModal}
                mode = "create"
                onSubmitCallback= {api.triggerReload}
                />
            </Card>       
        </>
    );
};

export default WeightedAverageTable;
