import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDFBoost from "../../../CitizenDashboard/Pages/Payment/InvoicePDFBoost";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import Loading from "../../../../../Components/Loading/Loading";

const PaymentSuccessBoost = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const session_id = searchParams.get("session_id");
  useEffect(() => {
    if (session_id) {
      axiosSecure
        .patch(`/payment-boost-success?session_id=${session_id}`)
        .then((res) => {
          setPaymentData(res.data.data);
          setLoading(false);
        });
    }
  }, [axiosSecure, session_id]);

  if (loading) return <Loading></Loading>;

  if (!paymentData) return <p>Payment not found!</p>;

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="animate-bounce inline-block">
            <svg
              className="w-24 h-24 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl mb-2">
          Your issue has been <strong>BOOSTED</strong> to High Priority
        </p>
        <p className="text-gray-600 mb-8">
          It will now appear at the top of all lists!
        </p>

        <PDFDownloadLink
          className="btn btn-outline btn-success mb-6"
          document={<InvoicePDFBoost issue={paymentData} />}
          fileName="Issues Boosted Invoice.pdf"
        >
          {({ loading }) =>
            loading ? "Generating..." : "Download Invoice (PDF)"
          }
        </PDFDownloadLink>

        <div className="flex gap-4 justify-center">
          <Link
            to={`/issue/${paymentData.issue_id}`}
            className="btn btn-primary"
          >
            View Issue
          </Link>
          <Link to="/dashboard/my-issues" className="btn btn-ghost">
            My Issues
          </Link>
        </div>

        <div className="mt-10 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Timeline Updated:</strong> "Issue boosted to High Priority
            via payment"
          </p>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccessBoost;
