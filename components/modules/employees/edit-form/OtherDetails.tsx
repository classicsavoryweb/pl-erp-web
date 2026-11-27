import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';
import ReferralDropDown from '../../generic/ReferralDropDown';
import EmployeeDropDown from '../../generic/EmployeeDropDown';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const OtherDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    const isPhotoline = formHandler.values.referred_by === "Photoline";
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-blue-800 dark:text-blue-500">Others</p>
            <ReferralDropDown
                onChange={formHandler.handleChange}
                label='Source of hire:'
                name="referred_by"
                placeholder='select referral'
                value={formHandler.values.referred_by || ""}
            />
            {isPhotoline && (
                <EmployeeDropDown
                    onChange={formHandler.handleChange}
                    label='Referred By:'
                    name="employee_referred"
                    placeholder='select referral'
                    value={formHandler.values.employee_referred || ""}
                />
            )}
            <TextArea
                onChange={formHandler.handleChange}
                label='Remarks'
                name="remarks"
                value={formHandler.values.remarks || ""}
                placeholder='enter remarks'
            />
        </Card>
    );
};

export default OtherDetails;