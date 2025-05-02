import PageTitle from "@/components/common/PageTitle";
import DiagnosisTableCard from "@/components/modules/maintenance/diagnosis/DiagnosisTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Diagnosis"
            />
            <DiagnosisTableCard/>
        </>
    );
};

export default Page;