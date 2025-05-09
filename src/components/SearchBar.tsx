import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`input-group mb-3 ${className}`} style={{ maxWidth: 400 }}>
    <span className="input-group-text bg-white border-end-0" id="search-addon">
      <i className="bi bi-search" aria-hidden="true"></i>
    </span>
    <input
      type="text"
      className="form-control border-start-0"
      placeholder={placeholder}
      aria-label={placeholder}
      aria-describedby="search-addon"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default SearchBar; 