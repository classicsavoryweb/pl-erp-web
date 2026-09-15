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
import { Bar, Line } from 'react-chartjs-2';
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

    const lineGraphOptions = {
        responsive: true,
        plugins: {
            legend: {
            display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 250000,
                    display: false
                }
            }
        }
    };

    const lineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
        {
            label: 'Gross Pay',
            data: Array.from({ length: 12 }, (_, i) => data.labor_cost?.[i + 1] ?? 0),
            borderColor: 'rgba(22, 101, 52, .6)',
            backgroundColor: 'rgba(22, 101, 52, 0.4)',
            pointBackgroundColor: 'rgba(22, 101, 52, .6)',
            pointRadius: 4,
            tension: 0.3,
            fill: true,
        }
        ]
    };

    const deductionsGraphOptions = {
        responsive: true,
        plugins: {
            legend: {
            display: false,
            },
        },
        scales: {
            y: {
            beginAtZero: true,
            ticks: {
                stepSize: 250000,
            }
            }
        }
    };

    const deductionsLineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
        {
            label: 'Deductions',
            data: Array.from({ length: 12 }, (_, i) => data.all_deductions?.[i + 1] ?? 0),
            borderColor: 'rgba(59, 130, 246, 0.7)',
            backgroundColor: 'rgba(59, 130, 246, 0.4)',
            pointBackgroundColor: 'rgba(59, 130, 246, 0.7)',
            pointRadius: 4,
            tension: 0.3,
            fill: true,
        }
        ]
    };

    const taxGraphOptions = {
        responsive: true,
        plugins: {
            legend: {
            display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 50000,
                }
            }
        }
    };

    const taxLineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Tax Withheld',
                data: Array.from({ length: 12 }, (_, i) => data.with_held_tax?.[i + 1] ?? 0),
                borderColor: 'rgba(239, 68, 68, .8)',
                backgroundColor: 'rgba(239, 68, 68, 0.4)',
                pointBackgroundColor: 'rgba(239, 68, 68, .8)',
                pointRadius: 4,
                tension: 0.3,
                fill: true,
            }
        ]
    };

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
                    title="Active Direct Employees"
                    displayReport={data.active_employees || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Payroll List"
                    displayReport={data.payroll_list || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Maternity Leave"
                    displayReport={data.on_maternity_leave || 0}
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
                <SummaryCardCount
                    title="Unposted Last Pay"
                    displayReport={data.unposted_last_pay || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Pending Converter"
                    displayReport={data.pending_converter || 0}
                    loading={loading}
                />
            </Grid>

            <Grid cols={3}>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Labor Cost</p>
                    <div className="pt-3">
                        <Bar
                            data={lineGraphData} options={lineGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Tax Withheld</p>
                    <div className="pt-3">
                        <Line
                            data={taxLineGraphData} options={taxGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Deductions</p>
                    <div className="pt-3">
                        <Line
                            data={deductionsLineGraphData} options={deductionsGraphOptions}
                        />
                    </div>
                </Card>
            </Grid>
        </>
    );
};

export default PayrollSummaryCards;