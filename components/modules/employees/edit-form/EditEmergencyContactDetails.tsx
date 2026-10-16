import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditEmergencyContactDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-blue-950 dark:text-red-500">Emergency Contact Details</p>
            <Textfield
                onChange={formHandler.handleChange}
                label='Contact Name'
                name="emergency_contact_name"
                value={formHandler.values.emergency_contact_name || ""}
                placeholder='enter name'
                required
                disabled={formHandler.values.type == "Agency"}
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='Contact No.'
                name="emergency_contact_number"
                placeholder='enter contact number'
                value={formHandler.values.emergency_contact_number || ""}
                required
                disabled={formHandler.values.type == "Agency"}
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='Relationship'
                name="emergency_contact_relationship"
                placeholder='enter relationship'
                value={formHandler.values.emergency_contact_relationship || ""}
                required
                disabled={formHandler.values.type == "Agency"}
            />
            <TextArea
                onChange={formHandler.handleChange}
                label='Address'
                name="emergency_contact_address"
                placeholder='enter address'
                value={formHandler.values.emergency_contact_address || ""}
                required
                disabled={formHandler.values.type == "Agency"}
            />
        </Card>
    );
};

export default EditEmergencyContactDetails;