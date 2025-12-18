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
  //console.log(payments, filter);

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
                <td>{payment.paidAt.split("at")[0]}</td>
                <td>
                  {payment.customer_email}
                  <br />
                  <span className="text-sm text-gray-600">
                    {/* {payment.user.email} */}
                  </span>
                </td>
                <td>
                  <div
                    className={`badge badge-soft ${
                      payment.amount === 10000
                        ? "badge-success"
                        : "badge-primary"
                    } px-0.5`}
                  >
                    {payment?.plan === "Premium Subscription"
                      ? "Premium"
                      : "Boost"}
                  </div>
                </td>
                <td className="font-bold text-green-600">
                  ৳{payment.amount / 100}
                </td>
                <td>
                  {payment.isBoosted ||
                    (payment.amount === 10000 && (
                      <PDFDownloadLink
                        className="btn btn-success btn-outline w-full"
                        document={<InvoicePDFBoost issue={payment} />}
                        fileName="Issues Boosted Invoice.pdf"
                      >
                        Download
                      </PDFDownloadLink>
                    ))}
                  {payment.isPremium ||
                    (payment.amount === 100000 && (
                      <PDFDownloadLink
                        className="btn btn-primary btn-outline w-full"
                        document={<InvoicePDF user={payment} />}
                        fileName="Profile Premium Invoice.pdf"
                      >
                        Download
                      </PDFDownloadLink>
                    ))}
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
