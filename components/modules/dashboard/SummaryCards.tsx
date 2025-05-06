"use client";
import Grid from "@/components/common/Grid";
import SummaryCardCount from "./SummaryCardCount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getAllSummaryDetails } from "@/api/dashboard";
import { toast } from "react-toastify";
import { useState } from "react";

const SummaryCards = () => {
    const [data, setData] = useState<any>({});

    useAsyncEffect(() => {
        getAllSummaryDetails()
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching summary details");
            } else {
                setData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
    }, []);

    return (
        <Grid
            cols={4}
        >
            <SummaryCardCount
                title="Contractual Employees"
                displayReport={data.contractual_employees || 0}
            />
            <SummaryCardCount
                title="Regular Employees"
                displayReport={data.regular_employees || 0}
            />
            <SummaryCardCount
                title="Probationary Employees"
                displayReport={data.probationary_employees || 0}
            />
            <SummaryCardCount
                title="Branches"
                displayReport={data.branches || 0}
            />
        </Grid>
    );
};

export default SummaryCards;