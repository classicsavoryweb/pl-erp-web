import VarianceReportTableCard from "@/components/modules/uniform/variance-report/VarianceReportTableCard";
import PageTitle from "@/components/common/PageTitle";

export default function VarianceReportPage() {
    return (
        <>
            <PageTitle title="Variance Report"/>
            <VarianceReportTableCard
                performPermission="perform_uniform_variance_report"
                createPermission="perform_uniform_variance_report_create"
                exportPermission="perform_uniform_variance_report_export"
                cancelPermission="perform_uniform_variance_report_cancel"
                reviewPermission="perform_uniform_variance_report_review"
                postPermission="perform_uniform_variance_report_post"
            />
        </>
    );
}
