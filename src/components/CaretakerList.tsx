interface CaretakerListProps {
  caretakers: any[];
  onEdit: (caretaker: any) => void;
}

const CaretakerList = ({ caretakers, onEdit }: CaretakerListProps) => (
  <table className="caretaker-list">
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {caretakers.map((c) => (
        <tr key={c.id}>
          <td>{c.name}</td>
          <td>{c.phone_number}</td>
          <td>
            <button onClick={() => onEdit(c)}>Edit</button>
            {/* Add delete button here if needed */}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CaretakerList; 