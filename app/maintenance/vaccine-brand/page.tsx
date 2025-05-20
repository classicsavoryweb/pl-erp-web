import PageTitle from "@/components/common/PageTitle";
import VaccineBrandTableCard from "@/components/modules/maintenance/vaccine-brand/VaccineBrandTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Vaccine Brand"
            />
            <VaccineBrandTableCard/>
        </>
    );
};

export default Page;