"use client";

import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import Badge from "@/components/common/Badge";
import { getAllCategories, getAllSubCategories } from "@/api/offenses";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import EditSubCategoryForm from "./EditSubCategoryForm";

const SubCategoryTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination(3);

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllSubCategories({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching subcategories");
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
            columnHead: "Name",
            path: "name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    name: data.name,
                    status: data.status
                });
            }
        },
    ];

    return (
        <>
            <div className="flex justify-end items-center">
                <div
                >
                    <Button
                        label="Create new sub category"
                        onClick={createModal.onOpen}
                    />
                </div>
            </div>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
                withActions
                actions={tableActions}
            />
            <CreateSubCategoryForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditSubCategoryForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default SubCategoryTableCard;