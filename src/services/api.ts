export async function fetchCaretakers() {
  // TODO: Replace with real API call
  return [
    { id: '1', name: 'John Doe', phone_number: '555-1234', assigned_villas: ['1'], extras: {} },
    { id: '2', name: 'Jane Smith', phone_number: '555-5678', assigned_villas: ['2'], extras: {} },
  ];
}

export async function fetchVillas() {
  // TODO: Replace with real API call
  return [
    { id: '1', villa_name: 'Villa Diana', phone_number: '555-0001' },
    { id: '2', villa_name: 'Villa Sunset', phone_number: '555-0002' },
  ];
} 