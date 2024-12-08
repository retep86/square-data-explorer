import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Bars3Icon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SettingsMenu = ({ menuOpen, menuPosition, columns, onToggleVisibility, onReset, onDragStart, onDrop }) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  return (
    menuOpen &&
    menuPosition &&
    ReactDOM.createPortal(
      <div
        className="absolute bg-white shadow-2xl rounded-md py-2 z-50 w-64"
        style={{ top: menuPosition.top, left: menuPosition.left }}
      >
        {columns.map((col, index) => (
          <div
            key={col.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(index);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={() => {
              onDrop(index);
              setDragOverIndex(null);
            }}
            className="relative flex items-center justify-between px-4 py-2 cursor-move"
          >
            {dragOverIndex === index && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
            )}
            <Bars3Icon className="h-4 w-4 text-gray-500 cursor-grab" />
            <span className="flex-grow ml-2">{col.label}</span>
            <button
              onClick={() => onToggleVisibility(col.id)}
              className="p-1"
            >
              {col.visible ? (
                <EyeIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        ))}
        <button
          onClick={onReset}
          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Reset Columns
        </button>
      </div>,
      document.body
    )
  );
};

export default SettingsMenu;
