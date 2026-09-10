
"use client";


import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import Badge from "@/components/common/Badge";
import { useState } from "react";
import { getAllRequestAndIssuance , exportAllRequestAndIssuance , exportRequestAndIssuanceDetails, updateRequestStatus} from "@/api/uniform/request-and-issuance";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import CancelRequestAndIssuance from "./UniformRequestAndIssuanceCancelForm"
import UniformRequestAndIssuanceForm from "./UniformRequestAndIssuanceForm";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";
import ActionDropDown from "@/components/common/ActionDropDown";



const UniformRequestAndIssuanceTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const viewModal = useModal();
    const reviewModal = useModal();
    const postModal = useModal();
    const cancelModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();


     useAsyncEffect(() => {
        api.setLoading(true);
        getAllRequestAndIssuance({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching uniform items");
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
            label: "Review",
            onClick: () => {
                setData(item);
                reviewModal.onOpen();
            },
        },
        item.status === "Reviewed" && {
            label: "Post",
            onClick: () => {
                setData(item);
                postModal.onOpen();
            }
        },
        ["Unposted", "Reviewed"].includes(item.status) && {
            label: "Cancel",
            onClick: () => {
                setData(item);
                cancelModal.onOpen();
            },
        },
    ].filter((action): action is { label: string; onClick: () => void } => Boolean(action));

    const downloadDetailedExport = async (item: any) => {
        const resp = await exportRequestAndIssuanceDetails(item.id);
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
        anchor.download = `REQUEST-AND-ISSUANCE-DETAILED-${item.request_number}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const columnSettings = [
        { columnHead: "Request Number", path: "request_number", columnType: COLUMNTYPES.string },
        { columnHead: "Date Requested", path: "date_requested", columnType: COLUMNTYPES.function,
            function: (data: any) =>
                data.date_requested ? moment(data.date_requested).format("MM/DD/YYYY") : "-",
        },
        { columnHead: "Item Name", path: "",columnType: COLUMNTYPES.function,
            function:(row : any) => row.items?.[0]?.description ?? "-"
        },
        { columnHead: "Quantity", path:"", columnType: COLUMNTYPES.function,
            function:(row : any) => row.items?.[0]?.requested_quantity ?? "-"
        },
        { columnHead: "Date Posted", path: "date_posted", columnType: COLUMNTYPES.function ,
            function: (data : any) =>
                data.date_posted ? moment(data.date_posted).format("MM/DD/YYYY") : "-", 
         },
        { columnHead: "Full Name", path: "employee_name", columnType: COLUMNTYPES.string },
       {
            columnHead: "Issuance Type",
            path: "issuance_type",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const value = row.issuance_type;

                return (
                    <span
                        className={`px-2 py-1 text-m font-semibold ${
                            value === "Authority To Deduct"
                                ? "text-red-600"
                                : "text-green-600"
                        }`}
                    >
                        {value === "Authority To Deduct" ? "ATD" : "FREE"}
                    </span>
                );
            },
        },
        { columnHead: "Branch", path: "branches.short_name", columnType: COLUMNTYPES.string },
        { columnHead: "Position", path: "position", columnType: COLUMNTYPES.string },
        { columnHead: "Date Hired", path: "date_hired", columnType: COLUMNTYPES.function,
            function: (data: any) =>
                data.date_hired ? moment(data.date_hired).format("MM/DD/YYYY") : "-"
        },
        
        { columnHead: "Total Amount", path: "total_amount", columnType: COLUMNTYPES.amount },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Posted": 
                        status = "success";
                        break;
                    case "Cancelled":
                        status = "danger";
                        break;
                    case "Reviewed":
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
            }
        },
        { columnHead: "ATD Status", path: "atd_status", columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.atd_status) {
                    case "ATD Generated": 
                        status = "success";
                        break;
                    case "ATD Acknowledged":
                        status = "warning";
                        break;
                    case "ATD Created":
                        status = "default";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.atd_status}
                    status={status}
                />
            }
        },
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
            label: "Add Uniform Request",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];
    return (
        <>
            <FilterCard
                filterHandler={filter}
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee_name",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Issuance Type",
                        path: "issuance_type",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Item Name",
                        path: "item_name",
                        columnType:COLUMNTYPES.string
                    },
                    {
                        columnHead: "Request Number",
                        path: "request_number",
                        columnType:COLUMNTYPES.string
                    }
                    
                ]}
                defaultColumnSelected="employee_name"
                hasExport
                api={exportAllRequestAndIssuance}
                exportFileName={`Request-and-Issuance-${moment().format("YYYY-MM-DD")}.xls`}
                withBranch
                withStatus
                isExpanded
                statusOption={[
                    {
                        label: "Unposted",
                        value: "Unposted"
                    },
                    {
                        label: "Posted",
                        value: "Posted"
                    },
                    {
                        label: "Reviewed",
                        value: "Reviewed"
                    },
                    {
                        label: "Cancelled",
                        value: "Cancelled"
                    },
                ]}
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
            </Card>
            <UniformRequestAndIssuanceForm 
                modal = {createModal}
                mode = "create"
                onSubmitCallback={api.triggerReload}
            />
            <UniformRequestAndIssuanceForm
                modal = {viewModal}
                mode = "view"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
            <UniformRequestAndIssuanceForm
                modal = {reviewModal}
                mode = "review"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
            <UniformRequestAndIssuanceForm
                modal = {postModal}
                mode = "post"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />

            <CancelRequestAndIssuance
                modal = {cancelModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default UniformRequestAndIssuanceTableCard;
