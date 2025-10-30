
import Modal from "@/components/common/Modal";
import Dropdown from "@/components/common/Dropdown";
import { useFormik } from "formik";
import confirm  from "@/components/common/Confirm";
import Button from "@/components/common/Button";
import moment from "moment";
import Checkbox from "@/components/common/Checkbox";
import { exportAllReportsSSSContributions } from "@/api/reports/reports-sss";

interface ModalInterface {
    modal: any;
    hasExport?: boolean;
    onSubmitCallback: () => void;
    unique_api?: (values: any) => any;
}

const SSSMonthlyContributionModal = ({
    modal,
    hasExport = true,
    onSubmitCallback,
    unique_api = exportAllReportsSSSContributions,
}: ModalInterface) => {

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i;
        return { label: String(year), value: String(year) };
    });

    const currentMonth = new Date().getMonth() + 1;
    const monthOptions = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].map((month, index) => ({
        label: month,
        value: index + 1
    }));

    const createFormHandler = useFormik({
        initialValues: {
            year: String(currentYear),
            month: String(currentMonth),
            with_dash: 0
        },
        onSubmit: async (values) => {

            const isConfirmed = await confirm({
                title: "Export Monthly Contribution",
                message: "Are you sure you want to export?"
            });

            if (isConfirmed) {
                unique_api && unique_api(values).then((resp: any) => {
                    const blob = new Blob([resp.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
    
                    a.href = downloadUrl;
                    a.download = `REPORTS-SSS-MONTHLY-CONTRIBUTION-${moment().format('YYYY-MM-DD')}.xls`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Export Monthly Contribution"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Dropdown
                    label="Year"
                    placeholder="Select year"
                    name="year"
                    value={createFormHandler.values.year}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.year}
                    options={yearOptions}
                />
                <Dropdown
                    label="Month"
                    placeholder="select month"
                    name="month"
                    value={createFormHandler.values.month}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.month}
                    options={monthOptions}
                />
                <Checkbox
                    label="with Dash"
                    checked={createFormHandler.values.with_dash === 1}
                    value="with_dash"
                    onChange={(e) => {
                        if (e.target.checked) {
                            createFormHandler.setFieldValue("with_dash", 1);
                        } else {
                            createFormHandler.setFieldValue("with_dash", 0);
                        }
                    }}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                            }}
                        />
                        { hasExport &&
                            <Button
                                type="submit"
                                label="Submit"
                                loading={createFormHandler.isSubmitting}
                                onClick={() => {}}
                            />
                        }
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default SSSMonthlyContributionModal;