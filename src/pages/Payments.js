import React, { useState, useRef, useEffect } from "react";
import Notification from "../components/Notification";
import TableHeader from "../components/TableHeader";
import SettingsMenu from "../components/SettingsMenu";
import DownloadMenu from "../components/DownloadMenu";
import paymentsData from "./paymentsData";

import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const menuButtonRef = useRef(null);
  const downloadButtonRef = useRef(null);

  const totalPages = Math.ceil(payments.length / recordsPerPage);

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

  const handleDownload = (format) => {
    if (format === "JSON") {
      const dataStr = JSON.stringify(payments, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "payments.json";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "CSV") {
      const headers = columns
        .filter((col) => col.visible)
        .map((col) => col.label)
        .join(",");
      const rows = payments.map((payment) =>
        columns
          .filter((col) => col.visible)
          .map((col) => payment[col.id])
          .join(",")
      );
      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "payments.csv";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "Excel") {
      import("xlsx").then((XLSX) => {
        const visibleColumns = columns.filter((col) => col.visible);
        const data = [
          visibleColumns.map((col) => col.label), // Headers
          ...payments.map((payment) =>
            visibleColumns.map((col) => payment[col.id])
          ),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        XLSX.writeFile(workbook, "payments.xlsx");
      });
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase().includes(search) ||
      payment.receipt_number.toLowerCase().includes(search)
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main className="flex flex-col bg-gray-100 h-screen">
      <div className="p-6">
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

      <div className="flex flex-col bg-white shadow-md rounded-md flex-grow mx-5 mb-5">
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
      onClick={() => alert("Advanced Search not implemented yet!")} // Placeholder action
      className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
    >
      Advanced Search
    </button>
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


        <div
          className="overflow-auto flex-grow"
          style={{
            maxHeight: "calc(100vh - 250px)", // Adjust based on header/footer heights
          }}
        >
          <table className="w-full border-collapse">
            <TableHeader
              columns={columns}
              columnWidths={columnWidths}
              sortConfig={sortConfig}
              onSort={handleSort}
              onAdjustWidth={adjustColumnWidth}
            />
            <tbody>
              {columns.every((col) => !col.visible) ? (
                <tr>
                  <td colSpan={columns.length} className="text-center text-gray-500 py-4">
                    No columns are visible. Use the settings menu to toggle column visibility.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    {columns.map(
                      (col) =>
                        col.visible && (
                          <td
                            key={col.id}
                            className="px-4 py-2 text-sm text-gray-700 border"
                          >
                            {payment[col.id]}
                          </td>
                        )
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-4 pt-3 bg-white border-t">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Records per page:</span>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Total Records: {payments.length}
            </span>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payments;
