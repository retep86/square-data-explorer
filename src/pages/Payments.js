// Imports
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import paymentsData from "./paymentsData";
import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  Bars3Icon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Components
const Notification = ({ visible, message, icon: Icon }) =>
  visible ? (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
      <Icon className="h-5 w-5 text-green-600" />
      <span>{message}</span>
    </div>
  ) : null;

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
                  onMouseDown={(e) => handleMouseDown(e, col.id, columnWidths[col.id], onAdjustWidth)}
                />
              </div>
            </th>
          )
      )}
    </tr>
  </thead>
);

const SettingsMenu = ({ menuOpen, menuPosition, columns, onToggleVisibility, onReset, onDragStart, onDrop }) =>
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(index)}
          className="flex items-center justify-between px-4 py-2 cursor-move"
        >
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
  );

const DownloadMenu = ({ menuOpen, menuPosition, onDownload }) =>
  menuOpen &&
  menuPosition &&
  ReactDOM.createPortal(
    <div
      className="absolute bg-white shadow-2xl rounded-md py-1 z-50 w-32"
      style={{ top: menuPosition.top, left: menuPosition.left }}
    >
      {["CSV", "Excel"].map((format) => (
        <button
          key={format}
          onClick={() => onDownload(format)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {format}
        </button>
      ))}
    </div>,
    document.body
  );

// Utility function
const handleMouseDown = (e, id, startWidth, onAdjustWidth) => {
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

// Main Component
function Payments() {
  const defaultColumns = [
    { id: "id", label: "Identifier", visible: true, width: 150 },
    { id: "status", label: "Status", visible: true, width: 150 },
    { id: "location_id", label: "Location ID", visible: true, width: 150 },
    { id: "order_id", label: "Order ID", visible: true, width: 150 },
    { id: "customer_id", label: "Customer ID", visible: true, width: 150 },
    { id: "receipt_number", label: "Receipt Number", visible: true, width: 150 },
  ];

  const [payments, setPayments] = useState(paymentsData);
  const [columns, setColumns] = useState(defaultColumns);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [columnWidths, setColumnWidths] = useState(
    defaultColumns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [downloadMenuPosition, setDownloadMenuPosition] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState(null);

  const menuButtonRef = useRef(null);
  const downloadButtonRef = useRef(null);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (menuOpen && menuButtonRef.current) {
        const buttonRect = menuButtonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: `${buttonRect.bottom + window.scrollY}px`,
          left: `${buttonRect.right - 256}px`,
        });
      }
      if (downloadMenuOpen && downloadButtonRef.current) {
        const buttonRect = downloadButtonRef.current.getBoundingClientRect();
        setDownloadMenuPosition({
          top: `${buttonRect.bottom + window.scrollY}px`,
          left: `${buttonRect.right - 128}px`,
        });
      }
    };
    window.addEventListener("resize", updateMenuPosition);
    updateMenuPosition();
    return () => window.removeEventListener("resize", updateMenuPosition);
  }, [menuOpen, downloadMenuOpen]);

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setPayments((prevPayments) =>
      [...prevPayments].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const adjustColumnWidth = (id, newWidth) => {
    setColumnWidths((prev) => ({ ...prev, [id]: Math.max(newWidth, 100) }));
  };

  const refreshPayments = () => {
    setPayments(paymentsData);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 3000);
  };

  const handleDragStart = (index) => setDraggedColumnIndex(index);

  const handleDrop = (index) => {
    if (draggedColumnIndex === null) return;
    const updatedColumns = [...columns];
    const [draggedItem] = updatedColumns.splice(draggedColumnIndex, 1);
    updatedColumns.splice(index, 0, draggedItem);
    setColumns(updatedColumns);
    setDraggedColumnIndex(null);
  };

  const toggleColumnVisibility = (id) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => setColumns(defaultColumns);

  const handleDownload = (format) => alert(`Download as ${format}`);

  return (
    <main className="flex-1 bg-gray-100 p-6 h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-600 text-sm mt-1">
          View and manage all payment records, including status, locations, and receipt numbers.
        </p>
      </div>

      <Notification
        visible={notificationVisible}
        message="Data refreshed successfully!"
        icon={CheckCircleIcon}
      />

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by status or receipt number"
            className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
          />
          <div className="relative flex items-center space-x-2">
            <button
              onClick={refreshPayments}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                ref={downloadButtonRef}
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
              </button>
              <DownloadMenu
                menuOpen={downloadMenuOpen}
                menuPosition={downloadMenuPosition}
                onDownload={handleDownload}
              />
            </div>
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
              </button>
              <SettingsMenu
                menuOpen={menuOpen}
                menuPosition={menuPosition}
                columns={columns}
                onToggleVisibility={toggleColumnVisibility}
                onReset={resetColumns}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <table className="w-full border-collapse">
            <TableHeader
              columns={columns}
              columnWidths={columnWidths}
              sortConfig={sortConfig}
              onSort={handleSort}
              onAdjustWidth={adjustColumnWidth}
            />
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}
                >
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td key={col.id} className="px-4 py-2 text-sm text-gray-700 border">
                          {payment[col.id]}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Payments;