import PhysicalCountTableCard from "@/components/modules/uniform/physical-count/PhysicalCountTableCard";
import PageTitle from "@/components/common/PageTitle";

export default function PhysicalCountPage() {
    return (
        <>
            <PageTitle title= "Physical Count" />
            <PhysicalCountTableCard
                performPermission="perform_uniform_physical_count"
                createPermission="perform_uniform_physical_count_create"
                exportPermission="perform_uniform_physical_count_export"
                cancelPermission="perform_uniform_physical_count_cancel"
                updateQuantityPermission="perform_uniform_physical_count_update_quantity"
                reviewPermission="perform_uniform_physical_count_review"
                postPermission="perform_uniform_physical_count_post"
            />
        </>
    );
};
