export interface PayrollDetails {
  id: number
  employee_id: string
  timekeeping_summary_id: string
  timekeeping_branch_id: string
  pay_date: string
  cut_off: string
  start_date: string
  end_date: string
  daily_rate: string
  hourly_rate: string
  pay_type: string
  tax_status: string
  salary: string
  tardiness_amount: string
  undertime_amount: string
  overtime_amount: string
  legal_holiday_amount: string
  legal_holiday_overtime_amount: string
  special_holiday_amount: string
  special_holiday_overtime_amount: string
  night_differential_amount: string
  night_differential_overtime_amount: string
  taxable_adjustment: string
  non_taxable_adjustment: string
  cancelled_off: string
  gross_pay: string
  employee_sss: string
  employer_sss: string
  employee_pagibig: string
  employer_pagibig: string
  employee_philhealth: string
  employer_philhealth: string
  withholding_tax: string
  deductions: string
  total_deductions: string
  manual_deductions: string
  net_pay: string
  status: string
  remarks: any
  created_at: string
  updated_at: string
  employee: Employee
  timekeeping_branch: any
  timekeeping_summary: TimekeepingSummary
  incentives: Incentives
  tardiness_list: TimeKeeping[]
  undertime_list: TimeKeeping[]
  taxable_income: string
  contribution_total : string,
  additional_working_hours_total: string,
  working_hours_deduction_total: string,
  tardiness_offenses: TardinessOffense[]
}

interface Employee {
  id: number
  employee_number: string
  employee_number_2: string
  biometric_number: string
  image: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  civil_status: string
  gender: string
  height: string
  birthday: string
  birthplace: string
  address: string
  provincial_address: string
  region: string
  contact_number: string
  tax_type: string
  tin: string
  sss: string
  philhealth: string
  pagibig: string
  referred_by: any
  remarks: any
  date_hired: string
  regularization_date: any
  separation_date: any
  separation_reason: string
  type: string
  emergency_contact_name: string
  emergency_contact_number: string
  emergency_contact_address: string
  emergency_contact_relationship: string
  education_history_id: string
  agency_id: any
  employee_status_id: string
  position_id: string
  station_id: string
  branch_id: string
  home_branch_id: string
  status: string
  oic_status: any
  created_at: string
  updated_at: string
  full_name: string
  position: string
  proper_full_name: string
  formal_full_name: string
  age: number
  monthly_salary: string
  daily_salary: number
  cut_off_base_salary: number
  current_branch: CurrentBranch
  current_position: CurrentPosition
  schedule: Schedule
  home_branch: HomeBranch
  latest_bank_details: LatestBankDetails
}

interface CurrentBranch {
  id: number
  branch_number: string
  name: string
  short_name: string
  address: string
  location: string
  date_open: string
  company: string
  branch_email: string
  rate_code: string
  branch_head_employee_number: string
  group_head_employee_number: string
  branch_head: string
  group_head: string
  kitchen_oic_employee_number: string
  kitchen_oic: string
  mancom_employee_number: string
  mancom: string
  status: string
  created_at: string
  updated_at: string
  travel_time: any
  device_name: any
  type: string
  expense_debit: any
  expense_credit: any
  advance_debit: any
  advance_credit: any
  ho_13th_debit: any
  ho_13th_debit_1: any
  ho_13th_credit: any
  branch_ho_13th_debit: any
  branch_ho_13th_debit_1: any
  branch_ho_13th_credit: any
  branch_ho_stat_debit: any
  branch_ho_stat_credit: any
}

export interface CurrentPosition {
  id: number
  description: string
  rank: string
  status: string
  station_id: string
  created_at: string
  updated_at: string
  schedule_type: string
  timekeeping_type: string
  salary: Salary
}

export interface Salary {
  id: number
  position_id: string
  basic_salary: string
  rate_category: string
  status: string
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: number
  employee_id: string
  schedule_type_id: string
  incentive_leave: string
  flexible_schedule: string
  created_at: string
  updated_at: string
  schedule_type: ScheduleType
}

export interface ScheduleType {
  id: number
  name: string
  status: string
  created_at: string
  updated_at: string
}

export interface HomeBranch {
  id: number
  branch_number: string
  name: string
  short_name: string
  address: string
  location: string
  date_open: string
  company: string
  branch_email: string
  rate_code: string
  branch_head_employee_number: string
  group_head_employee_number: string
  branch_head: string
  group_head: string
  kitchen_oic_employee_number: string
  kitchen_oic: string
  mancom_employee_number: string
  mancom: string
  status: string
  created_at: string
  updated_at: string
  travel_time: any
  device_name: any
  type: string
  expense_debit: any
  expense_credit: any
  advance_debit: any
  advance_credit: any
  ho_13th_debit: any
  ho_13th_debit_1: any
  ho_13th_credit: any
  branch_ho_13th_debit: any
  branch_ho_13th_debit_1: any
  branch_ho_13th_credit: any
  branch_ho_stat_debit: any
  branch_ho_stat_credit: any
}

export interface TimekeepingSummary {
  id: number
  cut_off: string
  employee_id: string
  branch_id: string
  regular_days: string
  special_leave: string
  cancelled_off: string
  special_holiday: string
  legal_holiday: string
  regular_overtime: string
  night_differential: string
  night_differential_overtime: string
  legal_holiday_overtime: string
  special_holiday_overtime: string
  undertime: string
  tardiness: string
  travel_time: string
  adjustment_amount: string
  remarks: any
  created_at: string
  updated_at: string
}

export interface LatestBankDetails {
  bank_account_type_id : string;
  bank_number : string;
  created_at : string;
  employee_id : string
  id : number;
  remarks : string;
  updated_at : string;
}

export interface Incentives {
  id: number
  employee_id: string
  position_id: string
  branch_id: string
  incentive_amount: number
  max_amount: number
  remarks: string
  pay_date: string
  amount_rate: number
  additional_incentive: number
  adjustment_days: number
  adjustment_percent: number
  status: string 
}

export interface TimeKeeping {
  id: number
  date: string
  employee_id: string
  branch_id: string
  regular_days: string
  special_leave: string
  cancelled_off: string
  special_holiday: string
  legal_holiday: string
  regular_overtime: string
  night_differential: string
  night_differential_overtime: string
  legal_holiday_overtime: string
  special_holiday_overtime: string
  undertime: string
  tardiness: string
  travel_time: string
  adjustment_amount: string
  remarks: any
  created_at: string
  updated_at: string
  payment: TimeKeepingPayment
}

export interface TimeKeepingPayment {
  adjustment_timekeeping_id : string | null
  base_amount : string
  cancelled_off : string
  created_at : string
  id : number
  legal_holiday : string
  legal_holiday_overtime : string
  night_differential : string
  night_differential_overtime : string
  regular_overtime : string
  special_holiday : string
  special_holiday_overtime : string
  tardiness_deduction : string
  timekeeping_id : string
  total_amount : string
  type : string
  undertime_deduction : string
  updated_at : string
}

export interface TardinessOffense {
  id: number;
  employee_id: string;
  branch_id: string;
  month: string;
  year: string;
  total_minutes: string;
  tardiness_sanction_id: string;
  offense_punishment: string;
  reason: string;
  status: string;
  da_status: string;
  da_date_sent: string;
  nte_status: string;
  nte_date_sent: string;
  created_at: string;
  updated_at: string;
}