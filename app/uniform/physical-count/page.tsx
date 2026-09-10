import PhysicalCountTableCard from "@/components/modules/uniform/physical-count/PhysicalCountTableCard";
import PageTitle from "@/components/common/PageTitle";

export default function PhysicalCountPage() {
    return (
        <>
            <PageTitle title= "Physical Count" />
            <PhysicalCountTableCard
                performPermission="perform_uniform_physical_count"
                reviewPermission="perform_uniform_physical_count_review"
                postPermission="perform_uniform_physical_count_post"
            />
        </>
    );
};
