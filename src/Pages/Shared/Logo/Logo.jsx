import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <>
      <Link to={"/"}>
        <div className="h-7 overflow-hidden">
          <img
            src="/FIX_CITY.png"
            alt="FIX_CITY LOGO"
            className="h-full object-cover"
          />
        </div>
      </Link>
    </>
  );
};

export default Logo;
