"use client";
import Grid from "@/components/common/Grid";
import SummaryCardCount from "./SummaryCardCount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getAllSummaryDetails } from "@/api/dashboard";
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
    const {userDetails} = useContext(AuthContext);

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
            borderColor: 'rgba(22, 101, 52, .6)',
            backgroundColor: 'rgba(22, 101, 52, 0.4)',
            pointBackgroundColor: 'rgba(22, 101, 52, .6)',
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
                stepSize: 30,
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

    const promotionGraphOptions = {
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
                stepSize: 10,
            }
            }
        }
    };

    const promotionLineGraphData = {
        labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
        {
            label: 'Promoted Employees',
            data: Array.from({ length: 12 }, (_, i) => data.monthly_promotions?.[i + 1] ?? 0),
            borderColor: 'rgba(59, 130, 246, 0.7)',
            backgroundColor: 'rgba(59, 130, 246, 0.4)',
            pointBackgroundColor: 'rgba(59, 130, 246, 0.7)',
            pointRadius: 4,
            tension: 0.3,
            fill: true,
        }
        ]
    };

    return (
        <>
            <Grid cols={2}>
                <Card>
                <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-x-5">
                        <Image
                            src={userDetails.gender === "Male" 
                                ? "/images/profile-pic-male.svg"
                                : "/images/profile-pic-female.svg"
                            }
                            width={120}
                            height={120}
                            alt="profile picture"
                        />
                        <div>
                            <p className="text-2xl font-semibold text-red-700 pb-3">{userDetails.last_name && userDetails.last_name + ","} {userDetails.first_name} {userDetails.middle_name && String(userDetails.middle_name).charAt(0) + "."}</p>
                            
                            <div className="flex gap-x-10">
                                <div>
                                    <div className="flex justify-start gap-x-1">
                                        <p className=" font-semibold text-gray-500">Position:</p>
                                        <p className="">{userDetails.position || "—"}</p>
                                    </div>
                                    <div className="flex justify-start gap-x-1">
                                        <p className=" font-semibold text-gray-500">Access Role:</p>
                                        <p className="">{String(userDetails.role_name).charAt(0).toUpperCase() + String(userDetails.role_name).slice(1) || "—"}</p>
                                    </div>
                                </div>
                                <div className="hidden 2xl:block">
                                    <div className="flex justify-start gap-x-1">
                                        <p className=" font-semibold text-gray-500">Email:</p>
                                        <p className=" wrap-anywhere">{userDetails.email || "—"}</p>
                                    </div>
                                    <div className="flex justify-start gap-x-1">
                                        <p className=" font-semibold text-gray-500">Contact Number:</p>
                                        <p className="">{userDetails.contact_number || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Card>
                
                <Grid
                    cols={2}
                >
                    <SummaryCardCount
                        title="Pending Employees"
                        displayReport={data.pending_employees || 0}
                        loading={loading}
                    />
                    <SummaryCardCount
                        title="Probationary Employees"
                        displayReport={data.probationary_employees || 0}
                        loading={loading}
                    />
                    <SummaryCardCount
                        title="Regular Employees"
                        displayReport={data.regular_employees || 0}
                        loading={loading}
                    />
                    <SummaryCardCount
                        title="Contractual Employees"
                        displayReport={data.contractual_employees || 0}
                        loading={loading}
                    />
                </Grid>
            </Grid>
        
            <Grid cols={3}>
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
			</Grid>
        </>
    );
};

export default SummaryCards;