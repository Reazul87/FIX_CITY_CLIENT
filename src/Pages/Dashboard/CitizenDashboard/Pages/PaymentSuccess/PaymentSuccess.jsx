import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import InvoicePDF from "../Payment/InvoicePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineStarBorderPurple500 } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import Loading from "../../../../../Components/Loading/Loading";
import useAuth from "../../../../../Hooks/useAuth/useAuth";

const PaymentSuccess = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const { user, loading } = useAuth();

  // const [loading, setLoading] = useState(true);
  const session_id = searchParams.get("session_id");
  useEffect(() => {
    if (session_id) {
      axiosSecure
        .patch(`/payment-success?session_id=${session_id}`)
        .then((res) => {
          setPaymentData(res.data.data);
          // //console.log(res.data);
        });
    }
  }, [session_id]);
  //console.log({ session_id, paymentData });

  const { data } = useQuery({
    queryKey: ["login-user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data;
    },
  });
  const dbUser = data?.result;

  if (loading) {
    return <Loading></Loading>;
  }

  if (!paymentData) {
    return <p>Payment not found!</p>;
  }
  console.log(paymentData);

  return (
    <>
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
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
            Premium Activated!
          </h1>
          <p className="text-xl mb-2">
            Congratulations, <strong>{paymentData.issue_name}</strong>!
          </p>
          <p className="text-lg text-gray-700 mb-6">
            You now have <strong>UNLIMITED</strong> issue reports + Priority
            support
          </p>

          <div className="flex mb-4 items-center justify-center space-x-2.5">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-md text-md font-bold">
              <FaStar size={20} fill="#FAFA33" />
              PREMIUM MEMBER
            </div>

            {dbUser?.isPremium && (
              <PDFDownloadLink
                className="btn btn-outline btn-success"
                document={<InvoicePDF user={paymentData} />}
                fileName="Profile Premium Invoice.pdf"
              >
                {({ loading }) =>
                  loading ? "Generating..." : "Download Invoice (PDF)"
                }
              </PDFDownloadLink>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/dashboard/report-issue" className="btn btn-primary">
              Report New Issue
            </Link>
            <Link
              to="/dashboard/my-issues"
              className="btn btn-accent btn-outline"
            >
              My Issues
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="card bg-base-100 shadow p-4">
              <h4 className="font-bold text-green-600">Unlimited Reports</h4>
              <p className="text-sm">No more 3-issue limit!</p>
            </div>
            <div className="card bg-base-100 shadow p-4">
              <h4 className="font-bold text-green-600">Priority Support</h4>
              <p className="text-sm">Your issues go to the top</p>
            </div>
            <div className="card bg-base-100 shadow p-4">
              <h4 className="font-bold text-green-600">Premium Badge</h4>
              <p className="text-sm">Show off your status</p>
            </div>
          </div>
          <div className="flex flex-col text-start">
            <h1 className="my-2.5 text-3xl">Payment Successful ✅</h1>
            <p>Transaction ID : {paymentData.transactionId}</p>
            <p>
              Amount Paid : {paymentData.amount} {paymentData.currency.toUpperCase()}
            </p>
            <p>Issue Name : {paymentData.user_name || "N/A"}</p>
            <p>Issue Email: {paymentData.customer_email}</p>
            <p>Paid At : {paymentData.paidAt}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
