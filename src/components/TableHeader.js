import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const TableHeader = ({ columns, columnWidths, sortConfig, onSort, onAdjustWidth }) => (
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
                  onMouseDown={(e) => onAdjustWidth(e, col.id, columnWidths[col.id])}
                />
              </div>
            </th>
          )
      )}
    </tr>
  </thead>
);

export default TableHeader;
