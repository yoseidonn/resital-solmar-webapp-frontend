// CareTaker
export interface CareTaker {
  id: number;
  name: string;
  phone_number: string;
  assigned_villas: Record<string, string[]>; // { [villaName]: string[] }
  rules: string[];
}

// Villa
export interface Villa {
  id: number;
  villa_name: string;
  phone_number: string;
  caretaker_id?: number | string;
}

// ResortReportFile
export interface ResortReportFile {
  id: number;
  name: string;
  date: string;
  uploaded_at: string;
  file: string;
}

// ResortReport
export interface ResortReport {
  id: number;
  accomodation_name: string;
  villa_id: number | string | null;
  supplier: string;
  resort: string;
  opportunity_name: number;
  lead_passenger: string;
  holiday_start_date: string;
  holiday_end_date: string;
  total_number_of_passenger: number;
  adults: number;
  children: number;
  infants: number;
  flight_arrival_date: string;
  flight_arrival_time: string;
  depature_date: string;
  departure_flight_time: string;
  extras_aggregated: string;
  villa_manager_visit_request: string;
  live_villa_manager: string;
  dt_aff_nane: string;
  resort_report_notes: string;
  resort_report_file?: number | string | null;
}

// ResortReportOutput
export interface ResortReportOutput {
  id: number;
  resort_report_file: number | string;
  content: any;
  individual_reservations: any[];
  created_at: string;
}

// APISReportFile
export interface APISReportFile {
  id: number;
  name: string;
  date: string;
  uploaded_at: string;
  file: string;
}

// APISReportOutput
export interface APISReportOutput {
  id: number | string;
  apis_report_file: number | string;
  file_path: string;
  created_at: string;
}

// AdvancedPassengerInformation
export interface AdvancedPassengerInformation {
  id: number;
  account_name: string;
  country: string;
  passenger_name: string;
  opportunity_name: number;
  accomodation_name: string;
  holiday_start_date: string;
  holiday_end_date: string;
  age: number;
  date_of_birth: string;
  country_of_issue: string;
  document_type: string;
  foid_number: string;
  foid_issue: string;
  foid_expiry: string;
  nationality: string;
  villa_id?: number | string | null;
  apis_report_file?: number | string | null;
} 