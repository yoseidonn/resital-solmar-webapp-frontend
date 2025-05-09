import React from 'react';

interface FilterRulesSectionProps {
  rules: string[];
}

const FilterRulesSection: React.FC<FilterRulesSectionProps> = ({ rules }) => (
  <div className="accordion my-2" id="filterRulesAccordion">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingRules">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseRules"
          aria-expanded="false"
          aria-controls="collapseRules"
        >
          Filter Rules
        </button>
      </h2>
      <div
        id="collapseRules"
        className="accordion-collapse collapse"
        aria-labelledby="headingRules"
        data-bs-parent="#filterRulesAccordion"
      >
        <div className="accordion-body">
          {rules.length > 0 ? (
            <ul className="mb-0 ps-3">
              {rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          ) : (
            <span className="text-muted">No filter rules.</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default FilterRulesSection; 