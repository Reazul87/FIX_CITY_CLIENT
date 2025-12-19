import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/loader.json";

const Loading2 = () => {
  return (
    <div className=" inset-0 z-10 fixed flex items-center justify-center bg-white/50">
      <div className="w-48 md:w-64">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Loading2;
