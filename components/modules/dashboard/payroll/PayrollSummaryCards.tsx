"use client";
import Grid from "@/components/common/Grid";
import SummaryCardCount from "../SummaryCardCount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getAllSummaryDetails, getPayrollSummaryDetails } from "@/api/dashboard";
import { getTenure } from "@/helper/tenure";
import { toast } from "react-toastify";
import Image from "next/image";
import { useState, useContext } from "react";
import Card from "@/components/common/Card";
import { Line } from 'react-chartjs-2';
import { AuthContext } from "@/context/AuthProvider";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import moment from "moment";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const PayrollSummaryCards = () => {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    useAsyncEffect(() => {
        setLoading(true);
        getPayrollSummaryDetails()
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching summary details");
            } else {
                setData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        }).then(() => {
            setLoading(false);
        })
    }, []);

    return (
        <>
            <Grid
                cols={4}
            >
                <SummaryCardCount
                    title="Active Cutoff"
                    displayReport={moment(data.active_cut_off?.start_date ?? "-").format("MMMM DD") + " - " + moment(data.active_cut_off?.end_date ?? "-").format("MMMM DD, YYYY")}
                    loading={loading}
                    type="text"
                />
                <SummaryCardCount
                    title="Payroll List"
                    displayReport={data.payroll_list || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Active Deductions"
                    displayReport={data.active_deductions || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Active Deductions Balance"
                    displayReport={Number(data.active_deductions_amount) || 0}
                    loading={loading}
                />
            </Grid>
        
            {/* <Grid cols={3}>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Monthly Hires</p>
                    <div className="pt-3">
                        <Line
                            data={lineGraphData} options={lineGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Monthly Promotions</p>
                    <div className="pt-3">
                        <Line
                            data={promotionLineGraphData} options={promotionGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Monthly Tardiness</p>
                    <div className="pt-3">
                        <Line
                            data={tardyLineGraphData} options={tardyGraphOptions}
                        />
                    </div>
                </Card> 
            </Grid> */}
        </>
    );
};

export default PayrollSummaryCards;