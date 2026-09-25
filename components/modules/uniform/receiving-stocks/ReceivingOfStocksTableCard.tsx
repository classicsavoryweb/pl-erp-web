"use client";

import { exportReceivingDetails, getReceivings } from "@/api/uniform/stock-replenishment";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import ActionDropDown from "@/components/common/ActionDropDown";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { AuthContext } from "@/context/AuthProvider";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import usePagination from "@/hooks/pagination";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import ReceivingStocksCreateForm from "./ReceivingStockstCreateForm";
import ReceivingStocksReviewForm from "./ReceivingStocksReviewForm";
import ReceivingStocksPostForm from "./ReceivingStocksPostForm";
import ReceivingStocksViewForm from "./ReceivingStocksViewForm"
import ReceivingStocksCancelForm from "./ReceivingStocksCancelForm";


const ReceivingOfStocksTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const reviewModal = useModal();
    const postModal = useModal();
    const viewModal = useModal();
    const cancelModal = useModal();
    const paginator = usePagination(10);
    const filter = useFilter();
    const [data, setData] = useState<any>({});
    const { permissions } = useContext(AuthContext);
    const canCreate = permissions.includes("perform_uniform_receiving_stocks_create");
    const canReview = permissions.includes("perform_uniform_receiving_stocks_review");
    const canPost = permissions.includes("perform_uniform_receiving_stocks_post");
    const canExport = permissions.includes("perform_uniform_receiving_stocks_export");
    const canCancel = permissions.includes("perform_uniform_receiving_stocks_cancel");

    useAsyncEffect(() => {
        api.setLoading(true);
        getReceivings({
            page:paginator.page,
            per_page:paginator.per_page,
            ...filter.filters,
        }).then((resp) => {
            if(resp.error){
                toast.error("Error fecthing Replenishment Data");
            }else{
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => toast.error("Error Encountered"))
        .finally(() => api.setLoading(false));
    },[paginator.reload, api.reload, filter.reload]);

    const downloadDetailedExport = async (record: any) => {
        const response =  await exportReceivingDetails(record.id)
            
        const payload = response?.data ?? response;
        const isBlob = payload instanceof Blob;
        const isArrayBuffer = payload && payload.byteLength !== undefined;

        if (!response || response.error || (!isBlob && !isArrayBuffer)) {
            toast.error(response?.data?.message || response?.message || "Export failed. Please try again.");
            return;
        }

        const blob = isBlob ? payload : new Blob([payload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        const transactionNo = record.request_no;
        const prefix =  "REPLENISHMENT-DETAILED";

        anchor.href = downloadUrl;
        anchor.download = `${prefix}-${transactionNo}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    const tableActions = (item : any ) => [
        {
            label:"View",
            onClick:() => {
                setData(item);
                viewModal.onOpen();
            }
        },
        canExport &&
        {
            label:"Detailed Export",
            onClick:() => {
                downloadDetailedExport(item)
            }
        },
        
        canReview && item.status === "Unposted" && 
        {    
            label:"Review",
            onClick:() => {
                setData(item);
                reviewModal.onOpen();
            }
        },
        canPost && item.status === "Reviewed" &&
        {
            label:"Post",
            onClick:() => {
                setData(item);
                postModal.onOpen();
            }
        },
        canCancel && ["Unposted","Reviewed"].includes(item.status) &&
        {
            label:"Cancel Receive",
            onClick:() => {
                setData(item);
                cancelModal.onOpen();
            }
        },
    ].filter(Boolean) as any[];

      const renderStatus = (record: any) => {
        let status: "default" | "success" | "warning" | "danger" = "default";

        switch (record.status) {
            case "Posted":
            case "Fully Received":
                status = "success";
                break;
            case "Cancelled":
                status = "danger";
                break;
            case "Reviewed":
            case "Partially Received":
                status = "warning";
                break;
        }

        return <Badge label={record.status} status={status} />;
    };
    
    const columnSettings = [
        { columnHead: "Receiving No.", path: "receiving_no", columnType: COLUMNTYPES.string },
        { columnHead: "Request No.", path: "replenishment.request_no", columnType: COLUMNTYPES.string},
        { columnHead: "Date Received", path: "supplier.vendor_name", columnType: COLUMNTYPES.string },
        { columnHead: "CRF No.", path: "crf_no", columnType: COLUMNTYPES.string },
        { columnHead: "Document No.", path: "document_no", columnType: COLUMNTYPES.string },
        { columnHead: "Amount",path: "total_amount",columnType: COLUMNTYPES.amount},
        { columnHead: "Status" , path: "status" , columnType:COLUMNTYPES.function, function: renderStatus,},
        { columnHead: "Action" , path: "id" , columnType:COLUMNTYPES.function, 
            function: (item: any) => <ActionDropDown data={item} actions={tableActions(item)} />
        }
    ];
    
     return (
            <>
                <FilterCard
                    columnSettings ={[
                         { columnHead: "Request Number", path: "request_no", columnType: COLUMNTYPES.string },
                        { columnHead: "Supplier", path: "supplier", columnType: COLUMNTYPES.string },
                    ]} 
                    filterHandler={filter}
                    defaultColumnSelected={"request_no"}
                    callBack={() => paginator.setPage}
                    withStatus
                    statusOption={[
                         { label: "Unposted", value: "Unposted" },
                        { label: "Reviewed", value: "Reviewed" },
                        { label: "Posted", value: "Posted" },
                        { label: "Partially Received", value: "Partially Received" },
                        { label: "Fully Received", value: "Fully Received" },
                        { label: "Closed", value: "Closed" },
                        { label: "Cancelled", value: "Cancelled" }
                    ]
                    }
                />
                <Card>
                    {canCreate && (
                        <div className="flex justify-end gap-x-3">
                            <DropDownButtons 
                            actions={[
                                {
                                label: "Create Replenishment Request",
                                onClick:createModal.onOpen,
                                }
                            ]}
                            />
                        </div>
                    )}
                    <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    />
                </Card>
                <ReceivingStocksCreateForm 
                    modal={createModal}
                    onSubmitCallback = {api.triggerReload}
                />
                <ReceivingStocksReviewForm 
                    modal = {reviewModal}
                    formValue = {data}
                    onSubmitCallback = {api.triggerReload}
                />
                <ReceivingStocksPostForm
                    modal = {postModal}
                    formValue = {data}
                    onSubmitCallback={api.triggerReload} 
                />
                <ReceivingStocksViewForm
                    modal = {viewModal}
                    formValue = {data}              
                />
                <ReceivingStocksCancelForm
                    modal = {cancelModal}
                    formValue={data}
                    onSubmitCallback={api.triggerReload} 
                />
            
            </>
        );




};

export default ReceivingOfStocksTableCard;