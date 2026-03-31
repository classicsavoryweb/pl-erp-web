"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { getAllBranches } from "@/api/branches";
import { COLUMNTYPES } from "@/constants/column";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RegionsTableCard = () => {
    const [regions, setRegions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        getAllBranches({ per_page: 10000 })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching regions");
                    return;
                }

                const groupedRegions = new Map<string, { id: string; region: string; branch_count: number }>();

                (resp.data?.data ?? []).forEach((branch: any) => {
                    const region = branch.location?.trim();
                    if (!region) {
                        return;
                    }

                    const existing = groupedRegions.get(region);
                    if (existing) {
                        existing.branch_count += 1;
                        return;
                    }

                    groupedRegions.set(region, {
                        id: region,
                        region,
                        branch_count: 1,
                    });
                });

                const nextRegions = Array.from(groupedRegions.values()).sort((a, b) =>
                    a.region.localeCompare(b.region)
                );

                if (isMounted) {
                    setRegions(nextRegions);
                }
            })
            .catch(() => {
                toast.error("Error fetching regions");
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Card>
            <Table
                dataSet={regions}
                loading={loading}
                columnSettings={[
                    {
                        columnHead: "Region",
                        path: "region",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Branch Count",
                        path: "branch_count",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
            />
        </Card>
    );
};

export default RegionsTableCard;
