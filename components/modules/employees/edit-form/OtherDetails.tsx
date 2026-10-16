import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';
import ReferralDropDown from '../../generic/ReferralDropDown';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const OtherDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-blue-950 dark:text-red-500">Others</p>
            <ReferralDropDown
                onChange={formHandler.handleChange}
                label='Referred By:'
                name="referred_by"
                placeholder='select referral'
                value={formHandler.values.referred_by || ""}
            />
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