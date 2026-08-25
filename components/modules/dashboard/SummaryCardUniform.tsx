"use client";
import Grid from "@/components/common/Grid";
import SummaryCardCount from "./SummaryCardCount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getUniformSummaryDetails } from "@/api/dashboard";
import { getTenure } from "@/helper/tenure";
import { toast } from "react-toastify";
import Image from "next/image";
import { useState, useContext } from "react";
import Card from "@/components/common/Card";
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { AuthContext } from "@/context/AuthProvider";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  BarElement,
  Title,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
  Filler
);

const SummaryCardUniform = () => {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const {userDetails} = useContext(AuthContext);

    useAsyncEffect(() => {
        setLoading(true);
        getUniformSummaryDetails()
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching summary details");
            } else {
                setData(resp.data);
                console.log(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        }).then(() => {
            setLoading(false);
        })
    }, []);

    const uniformGraphOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
        },
    };

    const uniformGraphData = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Authority To Deduct',
                data: Array.from(
                    { length: 12 },
                    (_, i) => data.total_atd?.[i + 1] ?? 0
                ),
                borderColor: 'rgba(22, 101, 52, 1)',
                backgroundColor: 'rgba(22, 101, 52, 0.5)',
                pointBackgroundColor: 'rgba(22, 101, 52, 1)',
                pointRadius: 4,
                tension: 0.2,
                fill: true,
            },
            {
                label: 'Free Uniform',
                data: Array.from(
                    { length: 12 },
                    (_, i) => data.total_free?.[i + 1] ?? 0
                ),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointRadius: 4,
                tension: 0.2,
                fill: true,
            },
        ],
    };

   const positiveVariance = Array.from(
        { length: 12 },
        (_, i) => Number(data.total_variance?.[i + 1]?.positive ?? 0)
    );

    const negativeVariance = Array.from(
        { length: 12 },
        (_, i) => Number(data.total_variance?.[i + 1]?.negative ?? 0)
    );

    const varianceValues = [
        ...positiveVariance,
        ...negativeVariance.map(value => Math.abs(value)),
    ];

    const axisLimit = Math.max(
        Math.ceil(Math.max(...varianceValues, 100) / 100) * 100,
        100
    );

    const varianceGraphOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
           tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'bar'>) => {
                        const value = context.raw as number;

                        return `${context.dataset.label}: ${value.toLocaleString()}`;
                    },

                    afterBody: (tooltipItems: TooltipItem<'bar'>[]) => {
                        const monthIndex = tooltipItems[0].dataIndex;

                        const positive = positiveVariance[monthIndex] ?? 0;
                        const negative = negativeVariance[monthIndex] ?? 0;
                        const total = positive + negative;

                        return `▢ Total Variance: ${total.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                min: -axisLimit,
                max: axisLimit,
                ticks: {
                    stepSize: 100,
                },
            },
        },
    };

    const varianceBarGraphData = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],

        datasets: [
            {
                label: 'Positive Variance',
                data: positiveVariance,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 5,
                stack: 'variance',
            },
            {
                label: 'Negative Variance',
                data: negativeVariance,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 5,
                stack: 'variance',
            },
           
            
        ],
    };
    const fastMovingItemsData = {
        labels: (data.most_requested_items ?? []).map(
            (item: {
                uniform_item_no: string;
                description: string;
                total_requested: number | string;
            }) => item.description
        ),

        datasets: [
            {
                label: 'Total Requested',
                data: (data.most_requested_items ?? []).map(
                    (item: {
                        uniform_item_no: string;
                        description: string;
                        total_requested: number | string;
                    }) => Number(item.total_requested)
                ),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 8,
            },
        ],
    };

    const fastMovingItemsOptions = {
        responsive: true,
        indexAxis: 'y' as const,
        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'bar'>) => {
                        return `Requested: ${Number(
                            context.raw
                        ).toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,

                ticks: {
                    stepSize: 5,
                },
            },
            y: {
                ticks: {
                    autoSkip: false,
                },
            },
        },
    };
    return (
        <>
            <Grid
                cols={5}
            >
                <SummaryCardCount
                    title="Ongoing Request"
                    displayReport={data.total_request || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Ongoing Replenishment"
                    displayReport={data.total_replenishment || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Partially Received Replenishment"
                    displayReport={data.total_partially_received || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Ongoing Receive Stocks"
                    displayReport={data.total_receiving || 0}
                    loading={loading}
                />
                 <SummaryCardCount
                    title="Free Uniform Limit"
                    displayReport={data.allowed_count || 0}
                    loading={loading}
                />
            </Grid>
        
            <Grid cols={3}>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Monthly Request and Issuances</p>
                    <div className="pt-3">
                        <Line
                            data={uniformGraphData} options={uniformGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Monthly Variances</p>
                    <div className="pt-3">
                        <Bar
                            data={varianceBarGraphData} options={varianceGraphOptions}
                        />
                    </div>
                </Card>
                <Card
                    size="graph"
                    loading={loading}
                >
                    <p>Fast Moving Items - Last Month</p>

                    <div className="pt-3">
                        <Bar
                            data={fastMovingItemsData}
                            options={fastMovingItemsOptions}
                        />
                    </div>
                </Card>
            </Grid>
        </>
    );
};

export default SummaryCardUniform;