import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import TextArea from '@/components/common/TextArea';
import Textfield from '@/components/common/Textfield';
import { FormikProps } from 'formik';
import React from 'react';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditDependents = ({
    formHandler,
    loading = true,
}: FormInterface) => {
    return (
        <Card
            loading={loading}
        >
            <p className="text-md font-semibold text-blue-950 dark:text-red-500">Dependents</p>

            <Grid cols={2}>
                {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                        <Textfield
                            onChange={formHandler.handleChange}
                            label="Name"
                            name={`dependents[${index}].dependent_name`}
                            value={formHandler.values.dependents?.[index]?.dependent_name || ''}
                            placeholder='enter name'
                        />
                        <Textfield
                            type='date'
                            onChange={formHandler.handleChange}
                            label="Birthday"
                            name={`dependents[${index}].birthday`}
                            value={formHandler.values.dependents?.[index]?.birthday || ''}
                        />
                    </React.Fragment>
                ))}
            </Grid>
        </Card>
    );
};

export default EditDependents;