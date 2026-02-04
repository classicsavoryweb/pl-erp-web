import Card from '@/components/common/Card';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';
import TaxTypeDropDown from '../../generic/TaxTypeDropDown';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditGovernmentIdentification = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-red-800 dark:text-red-500">Government Identification</p>

            <Textfield
                onChange={formHandler.handleChange}
                label='SSS'
                name="sss"
                value={formHandler.values.sss || ""}
                placeholder='enter sss'
                required
                disabled 
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='PAGIBIG'
                name="pagibig"
                value={formHandler.values.pagibig || ""}
                placeholder='enter pagibig'
                required
                disabled 
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='PHILHEALTH'
                name="philhealth"
                value={formHandler.values.philhealth || ""}
                placeholder='enter philhealth'
                required
                disabled
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='TIN'
                name="tin"
                placeholder='enter tin'
                value={formHandler.values.tin || ""}
                required
                disabled 
            />
            <TaxTypeDropDown
                onChange={formHandler.handleChange}
                label='Tax Type'
                name="tax_type"
                value={formHandler.values.tax_type || ""}
                placeholder='select tax type'
                required
                disabled 
            />
        </Card>
    );
};

export default EditGovernmentIdentification;