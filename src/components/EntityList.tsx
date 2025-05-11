import React from 'react';

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode[];
  headers: React.ReactNode[];
  children?: React.ReactNode; // for summary, search, etc.
}

function EntityList<T>({ items, renderItem, headers, children }: EntityListProps<T>) {
  return (
    <div>
      {children}
      <table className="table table-hover align-middle border">
        <thead className="table-light">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              {React.Children.toArray(renderItem(item, idx)).map((cell, cidx) => (
                <td key={cidx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EntityList; 