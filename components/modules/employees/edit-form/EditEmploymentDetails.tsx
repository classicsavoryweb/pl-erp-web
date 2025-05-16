import Card from '@/components/common/Card';
import { FormikProps } from 'formik';
import EmploymentStatusDropdown from '../../generic/EmploymentStatusDropDown';
import ActiveInactiveDropDown from '../../generic/ActiveInactiveDropDown';
import Grid from '@/components/common/Grid';
import Textfield from '@/components/common/Textfield';
import Image from 'next/image';
import Badge from '@/components/common/Badge';
import { getTenure } from '@/helper/tenure';
import { useContext } from 'react';
import { EmployeeContext } from '@/context/EmployeeProvider';

interface FormInterface {
    formHandler: FormikProps<any>;
    loading?: boolean;
}

const EditEmploymentDetails = ({
    formHandler,
    loading = true,
}: FormInterface) => {

    const {employee} = useContext(EmployeeContext);

    return (
        <Card
            loading={loading}
            size='medium'
        >
            <p className="text-md font-semibold text-red-800">Employment Details</p>
            <Grid
                cols={2}
            >
                <div className='col-span-2 pt-3'>
                    <div className="flex justify-between pb-5">
                        <div className="flex justify-start items-center gap-x-10">
                            <Image
                                src={ employee.profile_picture 
                                    ? employee.profile_picture 
                                    : employee.gender === "Male" 
                                        ? "/images/profile-pic-male.svg"
                                        : "/images/profile-pic-female.svg"
                                }
                                width={140}
                                height={140}
                                alt="profile picture"
                            />
                            <div>
                                <p className="text-2xl font-semibold">{employee.last_name}, {employee.first_name}</p>
                                <p className="text-md font-semibold text-gray-500">{employee.current_position?.description} - {employee.employee_number}</p>
                                <p className="text-md font-semibold text-gray-500">
                                    {getTenure(employee.date_hired, employee.separation_date)}
                                </p>
                                <p className="text-md font-semibold text-gray-500">{employee.employee_status?.description}</p>
                                <Badge
                                    status={employee.status === "active" ? "success" : "danger"}
                                    label={employee.status}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Textfield
                    type='file'
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                        formHandler.setFieldValue("image", file);
                        }
                    }}
                    label='Image'
                    name="image"
                />
                <EmploymentStatusDropdown
                    onChange={formHandler.handleChange}
                    label='Employment Status'
                    name="employee_status_id"
                    value={formHandler.values.employee_status_id}
                    placeholder='select employee status'
                    required
                />
                <Textfield
                    type='date'
                    onChange={formHandler.handleChange}
                    label='Date Hired'
                    name="date_hired"
                    value={formHandler.values.date_hired}
                    required
                />
                <Textfield
                    type='date'
                    onChange={formHandler.handleChange}
                    label='Regularization Date'
                    name="regularization_date"
                    value={formHandler.values.regularization_date || ""}
                    disabled={formHandler.values.employee_status_id != 2}
                />
                <ActiveInactiveDropDown
                    onChange={formHandler.handleChange}
                    label='Status'
                    name="status"
                    value={formHandler.values.status}
                    placeholder='select employee status'
                    required
                />
                { formHandler.values.status === "inactive" &&
                    <>
                        <EmploymentStatusDropdown
                            onChange={formHandler.handleChange}
                            label='Separation Reason'
                            name="separation_reason"
                            value={formHandler.values.separation_reason || ""}
                            placeholder='select employee status'
                            type="inactive"
                        />

                        <Textfield
                            type='date'
                            onChange={formHandler.handleChange}
                            label='Separation Date'
                            name="separation_date"
                            value={formHandler.values.separation_date || ""}
                        />
                    </>
                }
            </Grid>
        </Card>
    );
};

export default EditEmploymentDetails;