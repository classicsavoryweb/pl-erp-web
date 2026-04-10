import PageTitle from "@/components/common/PageTitle";
import ExportIncentiveAttendanceReportForm from "@/components/modules/reports/payroll/incentive-attendance/ExportIncentiveAttendanceReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Incentive Attendance"
            />
            <div className="w-[550px]">
                <ExportIncentiveAttendanceReportForm/>
            </div>
        </>
    );
};

export default Page;