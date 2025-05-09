import { useState } from 'react';

const EXTRAS = [
  { key: 'pool_heating', label: 'Pool Heating', texts: ['Include "havuz ısıtması" text'] },
  { key: 'cot', label: 'Cot', texts: ['Include "bebek yatağı" text'] },
  { key: 'welcome_pack', label: 'Welcome Pack', texts: ['Include "welcome paketi" text'] },
];

interface CaretakerFormProps {
  caretaker: any;
  villas: any[];
  onClose: () => void;
}

const CaretakerForm = ({ caretaker, villas, onClose }: CaretakerFormProps) => {
  const [name, setName] = useState(caretaker?.name || '');
  const [phone, setPhone] = useState(caretaker?.phone_number || '');
  const [assignedVillas, setAssignedVillas] = useState<string[]>(caretaker?.assigned_villas || []);
  const [extras, setExtras] = useState<{ [key: string]: { enabled: boolean; texts: string[] } }>(caretaker?.extras || {});

  const handleVillaChange = (villaId: string) => {
    setAssignedVillas((prev) =>
      prev.includes(villaId) ? prev.filter((id) => id !== villaId) : [...prev, villaId]
    );
  };

  const handleExtraChange = (key: string) => {
    setExtras((prev) => ({
      ...prev,
      [key]: {
        enabled: !prev[key]?.enabled,
        texts: prev[key]?.texts || [],
      },
    }));
  };

  const handleExtraTextChange = (key: string, text: string) => {
    setExtras((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        texts: prev[key]?.texts?.includes(text)
          ? prev[key].texts.filter((t: string) => t !== text)
          : [...(prev[key]?.texts || []), text],
      },
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: Call API to save caretaker
    onClose();
  };

  return (
    <div className="modal">
      <form className="caretaker-form" onSubmit={handleSubmit}>
        <h2>{caretaker ? 'Edit' : 'Add'} Caretaker</h2>
        <label>Name:<input value={name} onChange={e => setName(e.target.value)} required /></label>
        <label>Phone Number:<input value={phone} onChange={e => setPhone(e.target.value)} required /></label>
        <fieldset>
          <legend>Assign Villas</legend>
          {villas.map((villa: any) => (
            <label key={villa.id}>
              <input
                type="checkbox"
                checked={assignedVillas.includes(villa.id)}
                onChange={() => handleVillaChange(villa.id)}
              />
              {villa.villa_name}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Assign Extras</legend>
          {EXTRAS.map((extra) => (
            <div key={extra.key}>
              <label>
                <input
                  type="checkbox"
                  checked={extras[extra.key]?.enabled || false}
                  onChange={() => handleExtraChange(extra.key)}
                />
                {extra.label}
              </label>
              {extras[extra.key]?.enabled && (
                <div className="sub-checklist">
                  {extra.texts.map((text) => (
                    <label key={text}>
                      <input
                        type="checkbox"
                        checked={extras[extra.key]?.texts?.includes(text) || false}
                        onChange={() => handleExtraTextChange(extra.key, text)}
                      />
                      {text}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </fieldset>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CaretakerForm; 