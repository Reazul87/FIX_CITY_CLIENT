import React from "react";
import { NavLink } from "react-router";

const MyLink = ({ children, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "font-bold text-primary  bg-transparent"
          : "font-medium text-white/80 transition-all duration-200 hover:text-primary bg-transparent"
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
