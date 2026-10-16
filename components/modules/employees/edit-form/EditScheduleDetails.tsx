import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import { FormikProps } from 'formik';
import Dropdown from '@/components/common/Dropdown';
import ScheduleTypeDropDown from '../../generic/ScheduleTypeDropDown';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditScheduleDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
            size='medium'
        >
            <p className="text-md font-semibold text-blue-950 dark:text-red-500">Schedule Details</p>
            <ScheduleTypeDropDown
                label="Schedule Type"
                name="schedule_type"
                placeholder="select schedule type"
                onChange={formHandler.handleChange}
                value={formHandler.values.schedule_type}
                required
            />
            <Dropdown
                label="Flex Schedule"
                name="flexible_schedule"
                placeholder="select flex schedule"
                onChange={formHandler.handleChange}
                value={formHandler.values.flexible_schedule}
                options={[
                    {label: "Yes", value: "Yes"},
                    {label: "No", value: "No"},
                ]}
                required
            />
            <Dropdown
                label="Incentive Leave"
                name="incentive_leave"
                placeholder="select incentive leave"
                onChange={formHandler.handleChange}
                value={formHandler.values.incentive_leave}
                options={[
                    {label: "Yes", value: "Yes"},
                    {label: "No", value: "No"},
                ]}
                required
            />
        </Card>
    );
};

export default EditScheduleDetails;