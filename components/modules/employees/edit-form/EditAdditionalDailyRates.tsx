import Card from '@/components/common/Card';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditDailyRates = ({
    formHandler,
    loading = true,
}: FormInterface) => {

    console.log(
        "Additional Daily Rate:",
        formHandler.values.additional_daily_rate
    );

    return (
        <Card loading={loading}>
            <p className="text-md font-semibold text-blue-950 dark:text-blue-400">
                Additional Daily Rates
            </p>

            <Textfield
                onChange={formHandler.handleChange}
                label="Amount"
                name="additional_daily_rate.amount"
                value={formHandler.values.additional_daily_rate?.amount ?? "0"}
                placeholder="Enter amount"
            />
            <Textfield
                label="Date Added"
                name="additional_daily_rate.updated_at"
                value={
                    formHandler.values.additional_daily_rate?.updated_at
                        ? formHandler.values.additional_daily_rate.updated_at.slice(0, 10)
                        : ""
                }
                placeholder="Date added"
                disabled
            />
        </Card>
    );
};

export default EditDailyRates;