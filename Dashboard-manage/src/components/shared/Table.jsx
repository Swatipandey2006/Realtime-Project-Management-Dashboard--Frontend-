import React from "react";

// Table Component
export const Table = ({ headers = [], children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};

// Table Row
export const TableRow = ({ children, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={onClick ? "cursor-pointer hover:bg-gray-50" : ""}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
      {children}
    </td>
  );
};