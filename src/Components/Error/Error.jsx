import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";
import { FiHome } from "react-icons/fi";
import error from "../../assets/404.json";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Lottie
        animationData={error}
        loop={true}
        autoplay={true}
        style={{ width: 400, height: 400 }}
      ></Lottie>
      <div className="my-3 space-x-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn text-white border-none rounded-xl px-6 bg-gradient-to-r from-[#c276e6] to-[#8491de] hover:from-[#6272cf] hover:to-[#b75fe0]"
        >
          {" "}
          <FiHome />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
