import PageTitle from "@/components/common/PageTitle";
import ReportVaccinationTableCard from "@/components/modules/reports/vaccination/ReportVaccinationTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Vaccination"
            />
            <ReportVaccinationTableCard/>
        </>
    );
};

export default Page;