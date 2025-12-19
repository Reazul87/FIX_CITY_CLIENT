import React from "react";
import Lottie from "lottie-react";
import costumeAnimation from "../../assets/costume animation.json";

const Loading = () => {
  return (
    <div className=" inset-0 z-10 fixed flex items-center justify-center bg-white/50">
      <div className="w-48 md:w-64">
        <Lottie
          animationData={costumeAnimation}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default Loading;
