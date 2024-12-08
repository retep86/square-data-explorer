import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const ReusableTable = ({ data, columns, sortConfig, onSort, columnWidths, onAdjustWidth }) => {
  const handleMouseDown = (e, id, startWidth) => {
    const startX = e.clientX;
    const handleMouseMove = (event) => {
      const deltaX = event.clientX - startX;
      onAdjustWidth(id, startWidth + deltaX);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-white shadow">
        <tr>
          {columns.map(
            (col) =>
              col.visible && (
                <th
                  key={col.id}
                  style={{ width: columnWidths[col.id] }}
                  className="text-left px-4 py-2 text-sm font-medium text-gray-600 border relative"
                >
                  <div className="flex items-center">
                    {col.label}
                    <button onClick={() => onSort(col.id)} className="ml-2">
                      {sortConfig.key === col.id && sortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-900 font-bold" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-900 font-bold" />
                      )}
                    </button>
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown(e, col.id, columnWidths[col.id])}
                    />
                  </div>
                </th>
              )
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}
          >
            {columns.map(
              (col) =>
                col.visible && (
                  <td key={col.id} className="px-4 py-2 text-sm text-gray-700 border">
                    {row[col.id]}
                  </td>
                )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReusableTable;
