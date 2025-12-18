import React from "react";
import Lottie from "lottie-react";
import costumeAnimation from "../../assets/costume animation.json";

const Loading = () => {
  return (
    <div className="text-center">
      <div className="w-48 md:w-64 mx-auto mb-8">
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
