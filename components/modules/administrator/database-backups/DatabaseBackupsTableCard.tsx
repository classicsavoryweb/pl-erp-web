"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllDatabaseBackups } from "@/api/database-backups";
import { useState } from "react";
import DropDownButtons from "@/components/common/DropDownButtons";
import { createDatabaseBackup, downloadSqlFile } from "@/api/database-backups";
import confirm from "@/components/common/Confirm";

const DatabaseBackupsTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const [data] = useState<any>({});

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllDatabaseBackups({
            page: paginator.page,
            per_page: paginator.per_page
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching database backups");
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
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "File Name",
            path: "file_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Backed Up by",
            path: "backed_up_by",
            columnType: COLUMNTYPES.string
        },
    ];

    const globalActionSettings = [
        {
            label: "Backup Database",
            onClick: async () => {
                const isConfirmed = await confirm({
                    title: "Backup Database",
                    message: "Are you sure you want to create a database backup?",
                });

                if (isConfirmed) {
                    createDatabaseBackup(data.id).then((resp) => {
                        if (!resp.error) {
                            toast.success(resp.data.message);
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    });
                }
            },
            permission: "perform_database_backups"
        }
    ];

    const actions = [
        {
            label: "Download",
            onClick: async (data: any) => {
                try {
                    const response = await downloadSqlFile(data.file_name); 
                    
                    if (response && !response.error) {
                        const blob = new Blob([response.data], { type: 'application/sql' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = data.file_name; 
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }
                } catch (error) {
                    console.error('Download failed:', error);
                }
            },
            permission: "perform_database_backups"
        }
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={globalActionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={actions}
                />
            </Card>
        </>
    );
};

export default DatabaseBackupsTableCard;