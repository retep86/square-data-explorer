import React from "react";
import ReactDOM from "react-dom";
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

const DownloadMenu = ({ menuOpen, menuPosition, onDownload }) =>
  menuOpen &&
  menuPosition &&
  ReactDOM.createPortal(
    <div
      className="absolute bg-white shadow-2xl rounded-md py-1 z-50 w-32"
      style={{ top: menuPosition.top, left: menuPosition.left }}
    >
      {[
        { format: "CSV", icon: DocumentTextIcon },
        { format: "Excel", icon: DocumentDuplicateIcon },
        { format: "JSON", icon: CodeBracketIcon },
      ].map(({ format, icon: Icon }) => (
        <button
          key={format}
          onClick={() => onDownload(format)}
          className="block flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <Icon className="h-5 w-5 mr-2 text-gray-500" />
          {format}
        </button>
      ))}
    </div>,
    document.body
  );

export default DownloadMenu;
