import React from 'react';
import { Card, Form, Button, Col } from 'react-bootstrap';
import { ThermometerHalf, TruckFlatbed, GiftFill, Check } from 'react-bootstrap-icons';
import CreatableSelect from 'react-select/creatable';

const COMMON_EXTRAS = [
  { value: 'Pool Heating', label: 'Havuz Isıtması' },
  { value: 'Welcome Pack', label: 'Karşılama Paketi' },
  { value: 'Complimentary Cot', label: 'Bebek Yatağı' },
  // Add more common extras as needed
];

const VillaSelection = ({
  villas,
  villaRules,
  handleVillaChange,
  handleExtraChange,
  handleToggleAllExtrasForVilla
}) => {
  // Helper to determine if all extras are selected for showExtras
  const allExtrasValues = COMMON_EXTRAS.map(e => e.value);

  return (
    <>
      {villas.map((villa) => {
        const isSelected = villaRules.hasOwnProperty(villa.name);
        const rules = villaRules[villa.name] || {};
        return (
          <Col key={`col-${villa.name}`}>
            <Card className={`h-100 ${isSelected ? 'bg-light border-primary' : ''}`}>
              <Card.Header
                onClick={() => handleVillaChange(villa)}
                style={{ cursor: 'pointer' }}
                className="d-flex align-items-center"
              >
                <Form.Check
                  type="checkbox"
                  id={`check-${villa.name}`}
                  label={`${villa.name} ${villa.sorSat ? '(Sor-Sat)' : ''}`}
                  checked={isSelected}
                  onChange={() => {}} // Kart tıklaması ile değişecek
                  onClick={(e) => e.stopPropagation()}
                  className="mb-0"
                />
              </Card.Header>
              {isSelected && (
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">Ekstralar</small>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        const current = rules.showExtras || [];
                        if (current.length === allExtrasValues.length && allExtrasValues.every(val => current.includes(val))) {
                          handleExtraChange(villa.name, 'showExtras', []); // Deselect all
                        } else {
                          handleExtraChange(villa.name, 'showExtras', allExtrasValues); // Select all
                        }
                      }}
                      className="py-0 px-2"
                    >
                      <Check size={12} className="me-1" />
                      {rules.showExtras && rules.showExtras.length === allExtrasValues.length && allExtrasValues.every(val => rules.showExtras.includes(val))
                        ? 'Tüm Seçimi Kaldır'
                        : 'Tümünü Seç'}
                    </Button>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Sadece şu ekstralara sahip rezervasyonları dahil et</small>
                    <CreatableSelect
                      isMulti
                      options={COMMON_EXTRAS}
                      value={(rules.onlyWithExtras || []).map(val => ({ value: val, label: COMMON_EXTRAS.find(e => e.value === val)?.label || val }))}
                      onChange={selected => handleExtraChange(villa.name, 'onlyWithExtras', selected.map(opt => opt.value))}
                      placeholder="Ekstra seçin veya yazın..."
                      className="mb-2"
                    />
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Şu ekstraları tarihin yanında göster</small>
                    <CreatableSelect
                      isMulti
                      options={COMMON_EXTRAS}
                      value={(rules.showExtras || []).map(val => ({ value: val, label: COMMON_EXTRAS.find(e => e.value === val)?.label || val }))}
                      onChange={selected => handleExtraChange(villa.name, 'showExtras', selected.map(opt => opt.value))}
                      placeholder="Ekstra seçin veya yazın..."
                    />
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        );
      })}
    </>
  );
};

export default VillaSelection; 