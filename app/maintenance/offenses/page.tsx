import Accordion from "@/components/common/Accordion";
import Grid from "@/components/common/Grid";
import PageTitle from "@/components/common/PageTitle";
import CategoryTableCard from "@/components/modules/maintenance/offenses/category/CategoryTableCard";
import OffensesTableCard from "@/components/modules/maintenance/offenses/OffensesTableCard";
import SubCategoryTableCard from "@/components/modules/maintenance/offenses/subcategory/SubCategoryTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Offenses"
            />
            <Grid
                cols={2}
            >
                <Accordion
                    title="Categories"
                >
                    <CategoryTableCard/>
                </Accordion>
                <Accordion
                    title="Sub Categories"
                >
                    <SubCategoryTableCard/>
                </Accordion>
            </Grid>
            <OffensesTableCard/>
        </>
    );
};

export default Page;