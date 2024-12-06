import React, { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function Payments() {
  const [payments, setPayments] = useState([
    // Sample data for the table
    { id: 1, status: "Pending", location_id: 116, order_id: 1509, customer_id: 5605, receipt_number: "RCPT-44863" },
    { id: 2, status: "Pending", location_id: 161, order_id: 1817, customer_id: 5468, receipt_number: "RCPT-44031" },
    { id: 3, status: "Completed", location_id: 171, order_id: 1138, customer_id: 5545, receipt_number: "RCPT-47908" },
    { id: 4, status: "Cancelled", location_id: 189, order_id: 1822, customer_id: 5971, receipt_number: "RCPT-61896" },
    { id: 5, status: "Pending", location_id: 147, order_id: 1178, customer_id: 5523, receipt_number: "RCPT-08337" },
    { id: 6, status: "Completed", location_id: 119, order_id: 1612, customer_id: 5936, receipt_number: "RCPT-34725" },
    { id: 7, status: "Cancelled", location_id: 148, order_id: 1283, customer_id: 5995, receipt_number: "RCPT-84067" },
    { id: 8, status: "Pending", location_id: 143, order_id: 1554, customer_id: 5312, receipt_number: "RCPT-47298" },
    { id: 9, status: "Cancelled", location_id: 143, order_id: 1554, customer_id: 5312, receipt_number: "RCPT-68729" },
    { id: 10, status: "Completed", location_id: 176, order_id: 1960, customer_id: 5724, receipt_number: "RCPT-52893" },
  ]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase().includes(search) ||
      payment.receipt_number.toLowerCase().includes(search)
  );

  return (
    <main className="flex-1 bg-gray-100 p-6 h-screen">
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-600 text-sm mt-1">
          View and manage all payment records, including status, locations, and receipt numbers.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by email address, phone number, or receipt"
            className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => alert("Download functionality coming soon!")}
            className="ml-4 p-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
            <span className="ml-2 text-sm font-medium text-gray-700">Download</span>
          </button>
        </div>

        {/* Payments Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Identifier</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Status</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Location ID</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Order ID</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Customer ID</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 border">Receipt Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 border">{payment.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">{payment.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">{payment.location_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">{payment.order_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">{payment.customer_id}</td>
                  <td className="px-4 py-2 text-sm text-blue-600 border">{payment.receipt_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="p-4 flex items-center justify-between border-t">
          <span className="text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} results
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              &lt;
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              1
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              2
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payments;
