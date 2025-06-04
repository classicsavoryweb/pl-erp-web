"use client";
import Grid from "@/components/common/Grid";
import SummaryCardCount from "./SummaryCardCount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getAllSummaryDetails } from "@/api/dashboard";
import { toast } from "react-toastify";
import { useState } from "react";
import Card from "@/components/common/Card";
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const SummaryCards = () => {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    useAsyncEffect(() => {
        setLoading(true);
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
        }).then(() => {
            setLoading(false);
        })
    }, []);

    const lineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
        {
            label: 'Employees Hired',
            data: Array.from({ length: 12 }, (_, i) => data.monthly_hires?.[i + 1] ?? 0),
            borderColor: 'rgba(22, 101, 52, .8)',
            backgroundColor: 'rgba(22, 101, 52, 0.4)',
            pointBackgroundColor: 'rgba(22, 101, 52, .8)',
            pointRadius: 4,
            tension: 0.3,
            fill: true,
        }
        ]
    };

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
                stepSize: 20,
            }
            }
        }
    };

    const tardyGraphOptions = {
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
                stepSize: 50,
            }
            }
        }
    };

    const tardyLineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
        {
            label: 'Tardy Employees',
            data: Array.from({ length: 12 }, (_, i) => data.monthly_tardy?.[i + 1] ?? 0),
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
                    title="Contractual Employees"
                    displayReport={data.contractual_employees || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Regular Employees"
                    displayReport={data.regular_employees || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Probationary Employees"
                    displayReport={data.probationary_employees || 0}
                    loading={loading}
                />
                <SummaryCardCount
                    title="Branches"
                    displayReport={data.branches || 0}
                    loading={loading}
                />
        </Grid>
        
            <Grid cols={2}>
				<Card
                    size="medium"
                    loading={loading}
                >
					<p>Monthly Hires</p>
                    <div className="p-3">
                        <Line
                            data={lineGraphData} options={lineGraphOptions}
                        />
                    </div>
				</Card>

				<Card
                    size="medium"
                    loading={loading}
                >
					<p>Monthly Tardiness</p>
                    <div className="p-3">
                        <Line
                            data={tardyLineGraphData} options={tardyGraphOptions}
                        />
                    </div>
				</Card>
			</Grid>
        </>
    );
};

export default SummaryCards;