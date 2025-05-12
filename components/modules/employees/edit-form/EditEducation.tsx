import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditEducation = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-red-800">Education History</p>
            <Textfield
                onChange={formHandler.handleChange}
                label='College'
                name="education.college"
                value={formHandler.values.education?.college || ""}
                placeholder='enter education'
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='Address'
                name="education.college_address"
                value={formHandler.values.education?.college_address || ""}
                placeholder='enter course'
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='Course'
                name="education.course"
                value={formHandler.values.education?.course || ""}
                placeholder='enter course'
            />
            <Grid cols={2}>
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Year Started'
                    name="education.college_date_started"
                    value={formHandler.values.education?.college_date_started || ""}
                    placeholder='enter year started'
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Year Graduated'
                    name="education.college_date_graduated"
                    value={formHandler.values.education?.college_date_graduated || ""}
                    placeholder='enter year graduated'
                />
            </Grid>
            <TextArea
                onChange={formHandler.handleChange}
                label='Remarks'
                name="education.college_remarks"
                value={formHandler.values.education?.college_remarks || ""}
                placeholder='enter remarks'
            />
            <div className='py-2'>
                <hr className=" text-slate-300" />
            </div>
            <Textfield
                onChange={formHandler.handleChange}
                label='Highschool'
                name="education.highschool"
                value={formHandler.values.education?.highschool || ""}
                placeholder='enter highschooll'
            />
            <Textfield
                onChange={formHandler.handleChange}
                label='Address'
                name="education.highschool_address"
                value={formHandler.values.education?.highschool_address || ""}
                placeholder='enter course'
            />
            <Grid cols={2}>
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Year Started'
                    name="education.highschool_date_started"
                    value={formHandler.values.education?.highschool_date_started || ""}
                    placeholder='enter year started'
                />
                <Textfield
                    onChange={formHandler.handleChange}
                    label='Year Graduated'
                    name="education.highschool_date_graduated"
                    value={formHandler.values.education?.highschool_date_graduated || ""}
                    placeholder='enter year graduated'
                />
            </Grid>
            <TextArea
                onChange={formHandler.handleChange}
                label='Remarks'
                name="education.highschool_remarks"
                value={formHandler.values.education?.highschool_remarks || ""}
                placeholder='enter remarks'
            />
        </Card>
    );
};

export default EditEducation;