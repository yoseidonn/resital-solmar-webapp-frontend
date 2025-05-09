export async function fetchCaretakers() {
  // TODO: Replace with real API call
  return [
    { id: '1', name: 'John Doe', phone_number: '555-1234', assigned_villas: { "Villa Diana": ["Pool Heating", "Complimentary Cot", "Welcome Pack"], "Villa Mara S": ["Pool Heating", "Complimentary Cot", "Welcome Pack"] }, rules: ["Pool Heating", "Complimentary Cot"] },
    { id: '2', name: 'Jane Smith', phone_number: '555-5678', assigned_villas: { "Villa Sunset": ["Pool Heating", "Complimentary Cot", "Welcome Pack"] }, rules: ["Pool Heating", "Complimentary Cot"] },
  ];
}

export async function fetchVillas() {
  // TODO: Replace with real API call
  return [
    { id: '1', villa_name: 'Villa Diana', phone_number: '555-0001', caretaker_id: '1' },
    { id: '2', villa_name: 'Villa Sunset', phone_number: '555-0002', caretaker_id: '2' },
    { id: '3', villa_name: 'Villa Mara S', phone_number: '555-0003', caretaker_id: '1' },
  ];
} 

export async function fetchVillaDetails(villaId: string) {
  // TODO: Replace with real API call
  return {
    id: villaId,
    villa_name: 'Villa Diana',
    caretaker_id: '1'
  };
}

export async function fetchCaretakerDetails(caretakerId: string) {
  // TODO: Replace with real API call
  return {
    id: caretakerId,
    name: 'John Doe',
    phone_number: '555-1234',
    assigned_villas: { "Villa Diana": { "Pool Heating": true , "Complimentary Cot": true, "Welcome Pack": true} },
    rules: { "Pool Heating": true , "Complimentary Cot": true}
  };
}

export async function fetchResortReportFiles() {
  // TODO: Replace with real API call
  return [
    { id: '1', file_name: 'Resort Report 1', file_url: 'https://example.com/resort-report-1.pdf' },
    { id: '2', file_name: 'Resort Report 2', file_url: 'https://example.com/resort-report-2.pdf' },
  ];
}
