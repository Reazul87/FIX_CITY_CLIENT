import React from "react";
import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl text-red-400">
          Payment Cancelled . Please try again
        </h2>
        <Link to={"/dashboard/profile"} className="text-3xl text-red-700">
          Go to pay
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;
