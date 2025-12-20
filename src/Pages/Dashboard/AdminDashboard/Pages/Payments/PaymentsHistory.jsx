import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import InvoicePDFBoost from "../../../CitizenDashboard/Pages/Payment/InvoicePDFBoost";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../../CitizenDashboard/Pages/Payment/InvoicePDF";

const PaymentsHistory = () => {
  const [filter, setFilter] = useState({ type: "" });
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", filter],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments-admin?type=${filter.type}`);
      return res.data?.data;
    },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="select select-bordered w-full md:w-64"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option>Premium Subscription</option>
          <option>Issue Boost</option>
        </select>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.paidAt}</td>
                <td>{payment.customer_email}</td>
                <td>
                  <div
                    className={`badge  ${
                      payment.plan !== "Premium Subscription"
                        ? "badge-success"
                        : "badge-primary"
                    } `}
                  >
                    {payment?.plan === "Premium Subscription"
                      ? "Premium"
                      : "Boosted"}
                  </div>
                </td>
                <td className="font-bold text-green-600">
                  BDT{payment.amount}
                </td>
                <td>
                  {payment.plan === "Premium Subscription" ? (
                    <PDFDownloadLink
                      className="btn btn-primary btn-outline w-full"
                      document={<InvoicePDF user={payment} />}
                      fileName="Profile Premium Invoice.pdf"
                    >
                      Download
                    </PDFDownloadLink>
                  ) : (
                    <PDFDownloadLink
                      className="btn btn-success btn-outline w-full"
                      document={<InvoicePDFBoost issue={payment} />}
                      fileName="Issues Boosted Invoice.pdf"
                    >
                      Download
                    </PDFDownloadLink>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && payments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-500">No payments recorded yet.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentsHistory;
