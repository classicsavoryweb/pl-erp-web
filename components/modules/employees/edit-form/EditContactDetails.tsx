import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditContactDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-blue-950 dark:text-blue-500">Contact Details</p>
            <Grid cols={2}>
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Contact No.'
                    name="contact_number"
                    value={formHandler.values.contact_number || ""}
                    placeholder='enter contact'
                    required
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Email'
                    name="email"
                    value={formHandler.values.email || ""}
                    placeholder='enter email'
                    required
                />
                {/* <Textfield
                    label='Region'
                    name="region"
                    value={formHandler.values.region || ""}
                    placeholder='auto-filled from home branch'
                    required
                    disabled
                /> */}
            </Grid>
            <TextArea
                onChange={formHandler.handleChange}
                label='Present Address'
                name="address"
                value={formHandler.values.address || ""}
                placeholder='enter present address'
                required
            />
            {/* <TextArea
                onChange={formHandler.handleChange}
                label='Permanent Address'
                name="provincial_address"
                placeholder='enter permanent address'
                value={formHandler.values.provincial_address || ""}
                required
            /> */}
        </Card>
    );
};

export default EditContactDetails;
