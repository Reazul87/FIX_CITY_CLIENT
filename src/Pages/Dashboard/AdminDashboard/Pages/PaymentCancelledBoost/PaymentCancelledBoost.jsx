import React from "react";
import { useParams, Link } from "react-router";
import Swal from "sweetalert2";
import { useEffect } from "react";

const PaymentCancelledBoost = () => {
  const { id } = useParams();

  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Payment Cancelled",
      text: "Your boost payment was cancelled. No charge was made.",
      timer: 4000,
      showConfirmButton: false,
    });
  }, []);

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-orange-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-xl mb-4">You cancelled the boost payment.</p>
        <p className="text-gray-600 mb-8">
          No money was charged. Your issue remains Normal priority.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to={`/issue/${id}`} className="btn btn-primary">
            Back to Issue
          </Link>
          <Link to={`/issue/${id}`} className="btn btn-outline btn-warning">
            Try Boost Again
          </Link>
        </div>

        <div className="mt-10 p-4 bg-base-200 rounded-lg">
          <p className="text-sm">
            <strong>Tip:</strong> Boosting costs only ৳100 and puts your issue
            at the top!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelledBoost;
