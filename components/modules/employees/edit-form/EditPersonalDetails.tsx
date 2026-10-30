import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';
import GenderDropDown from '../../generic/GenderDropDown';
import CivilStatusDropDown from '../../generic/CivilStatusDropDown';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditPersonalDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
            size='medium'
        >
            <p className="text-md font-semibold text-blue-950 dark:text-blue-500">Personal Details</p>

            <Grid
                cols={2}
            >
                <Textfield
                    onChange={formHandler.handleChange}
                    label='First Name'
                    name="first_name"
                    value={formHandler.values.first_name || ""}
                    required
                    isUpperCase
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Middle Name'
                    name="middle_name"
                    value={formHandler.values.middle_name || ""}
                    isUpperCase
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Last Name'
                    name="last_name"
                    value={formHandler.values.last_name || ""}
                    required
                    isUpperCase
                />
                <Textfield
                    type='date'
                    onChange={formHandler.handleChange}
                    label='Birthday'
                    name="birthday"
                    value={formHandler.values.birthday || ""}
                    required
                />
                <GenderDropDown
                    placeholder='select gender'
                    onChange={formHandler.handleChange}
                    label='Gender'
                    name="gender"
                    value={formHandler.values.gender || ""}
                    required
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Height'
                    name="height"
                    value={formHandler.values.height || ""}
                    required
                    placeholder='enter height'
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Birthplace'
                    name="birthplace"
                    value={formHandler.values.birthplace || ""}
                    required
                    placeholder='enter birthplace'
                    isUpperCase
                />
                <CivilStatusDropDown
                    onChange={formHandler.handleChange}
                    label='Civil Status'
                    name="civil_status"
                    value={formHandler.values.civil_status || ""}
                    required
                    placeholder='select civil status'
                />
            </Grid>
        </Card>
    );
};

export default EditPersonalDetails;