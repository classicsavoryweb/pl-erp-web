
"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { getUniformSupplier } from "@/api/maintenance/vendor-supplier";
import AddVendorSupplierFormInactive from "./AddVendorSupplierForm";
import FilterCard from "../../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import DropDownButtons from "@/components/common/DropDownButtons";

const VendorSupplierTable = () => {
    const api = useApiCall();
    const createModal = useModal();
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getUniformSupplier({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
           
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching training titles");
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Vendor Number",
            path: "vendor_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Vendor Name",
            path: "vendor_name",
            columnType: COLUMNTYPES.string
        },
        
        
    ];
       const actionSettings = [
        {
            label: "Add Vendor",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];
    return (
        <>       
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Vendor Number",
                        path: "vendor_number",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Vendor Name",
                        path: "vendor_name",
                        columnType: COLUMNTYPES.string
                    },
                 
                    
                ]}
                filterHandler={filter}
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
            <AddVendorSupplierFormInactive 
                modal = {createModal}
                onSubmitCallback={api.triggerReload}
            />
            
        </>
    );
};

export default VendorSupplierTable;